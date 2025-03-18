import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient, SelectionSet } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import AddReleasePopup from './components/AddReleasePopup';
import ReleaseTable from './components/ReleaseTable.tsx';
import { Event } from 'react-big-calendar';
const client = generateClient<Schema>();
const localizer = momentLocalizer(moment);

function App() {
  const selectionSet = ['id', 'releaseId', 'releaseDate', 'releaseTitle', 'releaseBranch', 'preStagingEnv', 'releaseManager', 'currentState', 'qaPrime' ] as const;
  type ReleaseView = SelectionSet<Schema['Release']['type'], typeof selectionSet>;

  const [releases, setReleases] = useState<ReleaseView[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showReleases, setShowReleaseList] = useState(false);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [calStartDate, setCalStartDate] = useState(new Date());
  const [calEndDate, setCalEndDate] = useState(new Date());

  const [newRelease, setNewRelease] = useState({
    releaseId: "",
    releaseDate: "",
    releaseTitle: "",
    releaseBranch: "",
    preStagingEnv: "",
    currentState: "",
    releaseManager: "",
    qaPrime: ""
  });

  const { signOut } = useAuthenticator();

  useEffect(() => {
    client.models.Release.observeQuery(
      { 
        filter: { and
          : [
            { releaseDate: { ge: calStartDate.toISOString(), le: calEndDate.toISOString()  } },
          ]},
        selectionSet: [...selectionSet],
      },
    ).subscribe({
      next: (data) => setReleases([...data.items]),
    });
  }, [calStartDate, calEndDate]);


  async function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setNewRelease({ ...newRelease, [name]: value });
  }

  async function handleSubmit(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    const currentState = "NOT_READY";
    event.preventDefault();

    // invoke the createRelease "query"
    const result = await client.queries.CreateRelease( {...newRelease, currentState} );  
    if (result.errors) {
      console.error(result.errors);
      alert("Failed to create release: " + result.errors[0].message);
      return;
    }
    setShowForm(false);
  }

  async function selectEvent(event: Event) {
    const startDate = moment(event.start as Date);
    const endDate = moment(event.end as Date);
    const newStartDate = startDate.subtract(startDate.hours(), 'hours').toDate();
    const newEndDate = endDate.add(24-endDate.hours(), 'hours').toDate();

    setEndDate(newEndDate);
    setStartDate(newStartDate);

    setShowReleaseList(true);
  }


  const events = releases.map(release => ({
    title: release.releaseTitle,
    start: new Date(release.releaseDate!),
    end: new Date(release.releaseDate!),
  }));

  function selectRange(range: Date[] | { start: Date; end: Date; }): void {
    if (Array.isArray(range)) {
      setCalStartDate(range[0]);
      setCalEndDate(range[range.length - 1]);
    } else {
      setCalStartDate(range.start);
      setCalEndDate(range.end);
    }
  }
  
  return (
      <main>
        <h1>Releases</h1>
        <button type="button" onClick={() => setShowForm(true)}>Add Release</button>
        {showForm && (
          <AddReleasePopup
            newRelease={newRelease}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            closePopup={() => setShowForm(false)}
          />
        )}
        {showReleases && 
          <ReleaseTable startDate={startDate} endDate={endDate} />
        }
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={(event) => selectEvent(event)}
          onRangeChange={(range) => selectRange(range)}
          style={{ height: 500, margin: "50px" }}
        />
        <button onClick={signOut}>Sign out</button>
      </main>
  );
}

export default App;
