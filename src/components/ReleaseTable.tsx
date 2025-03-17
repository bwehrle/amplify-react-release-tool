import React from 'react';
import { useEffect, useState } from "react";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";


interface ReleaseTableProps {
    startDate: Date;
    endDate: Date;
}

const ReleaseTable: React.FC<ReleaseTableProps> = ({ releaseProp }) => {
    const client = generateClient<Schema>();
    const [releases, setReleases] = useState<Schema["Release"]["type"]>();
      useEffect(() => {
          client.models.Release.observeQuery(
            { 
              filter: { and
                : [
                  { releaseDate: { ge: releaseProp.startDate.toISOString(),  } },
                  { releaseDate: { le: releaseProp.endDate.toISOString() } }
                ]},
            },
          ).subscribe({
            next: (data) => setReleases([...data.items]),
          });
        }, []);
      
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ fontWeight: "bold", padding: "8px", border: "1px solid #ddd" }}>Release Date</th>
          <th style={{ fontWeight: "bold", padding: "8px", border: "1px solid #ddd" }}>Release Title</th>
          <th style={{ fontWeight: "bold", padding: "8px", border: "1px solid #ddd" }}>Release Branch</th>
          <th style={{ fontWeight: "bold", padding: "8px", border: "1px solid #ddd" }}>Pre Staging Env</th>
          <th style={{ fontWeight: "bold", padding: "8px", border: "1px solid #ddd" }}>Current State</th>
          <th style={{ fontWeight: "bold", padding: "8px", border: "1px solid #ddd" }}>Release Manager</th>
          <th style={{ fontWeight: "bold", padding: "8px", border: "1px solid #ddd" }}>QA Prime</th>
        </tr>
      </thead>
      <tbody>
        {releases.map((release) => (
          <tr key={release.id}>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>{release.releaseDate}</td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>{release.releaseTitle}</td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>{release.releaseBranch}</td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>{release.preStagingEnv}</td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>{release.currentState}</td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>{release.releaseManager}</td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>{release.qaPrime}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ReleaseTable;
