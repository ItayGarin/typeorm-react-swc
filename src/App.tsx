import "reflect-metadata";

import React, { useEffect, useState } from "react";
import { createConnection, EntityManager } from "typeorm/browser";
import { SqljsConnectionOptions } from "typeorm/driver/sqljs/SqljsConnectionOptions";
import Person from "./Person";

// @ts-ignore
window.SQL = require("sql.js/dist/sql-wasm");

export default function App() {
  const [em, setEm] = useState<null | EntityManager>(null);
  const [people, setPeople] = useState<Person[]>([]);

  useEffect(() => {
    (async () => {
      const connOpts: SqljsConnectionOptions = {
        type: "sqljs",
        entities: [Person],
        synchronize: true,
      };

      // @ts-ignore
      const conn = await createConnection(connOpts);
      const em = conn.createEntityManager();
      setEm(em);
    })();
  }, []);

  async function insert() {
    if (!em) {
      console.warn("em not initialized yet");
      return;
    }

    const person = new Person();
    person.name = "John Davis";

    em.insert(Person, person)
      .then(() => {
        console.log("inserted");
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function display() {
    if (!em) {
      console.warn("em not initialized yet");
      return;
    }

    em.find(Person).then((dbPeople) => {
      setPeople(dbPeople);
    });
  }

  return (
    <div>
      {people.map((person) => (
        <div key={person.id}>{person.name}</div>
      ))}

      <button onClick={insert}>Insert</button>
      <br />
      <button onClick={display}>Display</button>
    </div>
  );
}
