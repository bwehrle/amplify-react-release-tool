import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient, SelectionSet } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import AddReleasePopup from './components/AddReleasePopup';
import ReleaseTable from './components/ReleaseTable';
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
            { releaseDate: { ge: startDate.toISOString(),  } },
            { releaseDate: { le: endDate.toISOString() } }
          ]},
        selectionSet: [...selectionSet],
      },
    ).subscribe({
      next: (data) => setReleases([...data.items]),
    });
  }, []);

  async function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setNewRelease({ ...newRelease, [name]: value });
  }

  async function handleSubmit(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    const currentState = "NOT_READY";
    event.preventDefault();

    const result = await client.models.Release.create( {...newRelease, currentState} );  
    if (result.errors) {
      console.error(result.errors);
      alert("Failed to create release: " + result.errors[0].message);
      return;
    }
    setShowForm(false);
  }

  async function selectEvent(event: Event, e: React.SyntheticEvent<HTMLElement>) {
    setEndDate(event.end as Date);
    setStartDate(event.start as Date);
    setShowReleaseList(true);
  }


  const events = releases.map(release => ({
    title: release.releaseTitle,
    start: new Date(release.releaseDate!),
    end: new Date(release.releaseDate!),
  }));

  return (
      <main>
        <h1>Releases</h1>
        {showReleases && <ReleaseTable releases={releases} />}
        <button type="button" onClick={() => setShowForm(true)}>Add Release</button>
        {showForm && (
          <AddReleasePopup
            newRelease={newRelease}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            closePopup={() => setShowForm(false)}
          />
        )}
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={(event) => selectEvent(event)}
          style={{ height: 500, margin: "50px" }}
        />
        <button onClick={signOut}>Sign out</button>
      </main>
  );
}

export default App;
