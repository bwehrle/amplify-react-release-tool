import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';

const client = generateClient<Schema>();

function App() {
  const [releases, setReleases] = useState<Array<Schema["Release"]["type"]>>([]);
  const [showForm, setShowForm] = useState(false);
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
    client.models.Release.observeQuery().subscribe({
      next: (data) => setReleases([...data.items]),
    });
  }, []);

  async function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setNewRelease({ ...newRelease, [name]: value });
  }

  
  async function handleSubmit(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<boolean> {
    console.log("Creating release" + newRelease);
    const currentState = "NOT_READY";
    try {
      const result = await client.models.Release.create( {...newRelease, currentState} );  
      if (result.errors) {
        console.error(result.errors);
        alert("Failed to create release");
        return false;
      }
      setShowForm(false);
      console.log("Release created");
      return false;
    } catch (error) {
      console.error(error);
      alert("Failed to create release");
      return false;
    }
  }

  return (
      <main>
        <h1>Releases</h1>
        <ul>
            {releases.map((release) => (
            <li key={release.id} style={{ listStyleType: "none", marginBottom: "20px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: "bold", padding: "8px", border: "1px solid #ddd" }}>Release Date</td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{release.releaseDate}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold", padding: "8px", border: "1px solid #ddd" }}>Release Title</td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{release.releaseTitle}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold", padding: "8px", border: "1px solid #ddd" }}>Release Branch</td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{release.releaseBranch}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold", padding: "8px", border: "1px solid #ddd" }}>Pre Staging Env</td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{release.preStagingEnv}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold", padding: "8px", border: "1px solid #ddd" }}>Current State</td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{release.currentState}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold", padding: "8px", border: "1px solid #ddd" }}>Release Manager</td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{release.releaseManager}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold", padding: "8px", border: "1px solid #ddd" }}>QA Prime</td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{release.qaPrime}</td>
                  </tr>
                </tbody>
              </table>
            </li>
            ))}
        </ul>
        <button type="button" onClick={() => setShowForm(true)}>Add Release</button>
        <form style={{ display: showForm ? "block" : "none" }}>
          <div>
            <label>Release Date</label>
            <input type="text" name="releaseDate" value={newRelease.releaseDate} onChange={handleInputChange} />
          </div>
          <div>
            <label>Release Title</label>
            <input type="text" name="releaseTitle" value={newRelease.releaseTitle} onChange={handleInputChange} />
          </div>
          <div>
            <label>Release Branch</label>
            <input type="text" name="releaseBranch" value={newRelease.releaseBranch} onChange={handleInputChange} />
          </div>
          <div>
            <label>Pre Staging Env</label>
            <input type="text" name="preStagingEnv" value={newRelease.preStagingEnv} onChange={handleInputChange} />
          </div>
          <div>
            <label>Current State</label>
            <input type="text" name="currentState" value={newRelease.currentState} onChange={handleInputChange} />
          </div>
          <div>
            <label>Release Manager</label>
            <input type="text" name="releaseManager" value={newRelease.releaseManager} onChange={handleInputChange} />
          </div>
          <div>
            <label>QA Prime</label>
            <input type="text" name="qaPrime" value={newRelease.qaPrime} onChange={handleInputChange} />
          </div>
          <button type="button" onClick={handleSubmit}>Submit</button>
        </form>
        <button onClick={signOut}>Sign out</button>
      </main>
  );
}

export default App;
