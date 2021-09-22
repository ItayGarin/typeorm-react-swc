import "reflect-metadata";

import React, { useState, useEffect } from "react";

import { SqljsConnectionOptions } from "typeorm/driver/sqljs/SqljsConnectionOptions";
import Person from "./Person";
import { createConnection, EntityManager } from "typeorm/browser";

// @ts-ignore
window.SQL = require("sql.js/dist/sql-wasm");

export default function App() {
  const [em, setEm] = useState<null | EntityManager>(null);
  const [people, setPeople] = useState<Person[]>([]);
  
  // @ts-ignore
  useEffect(() => {
    (async () => {
      const connOpts: SqljsConnectionOptions = {
        type: "sqljs",
        entities: [Person],
        // logging: true,
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
      console.warn("em not initialized yet")
      return
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
  };

  async function display() {
    if (!em) {
      console.warn("em not initialized yet")
      return
    }

    const dbPeople = await em.find(Person)
    if (dbPeople)
      setPeople(dbPeople)
  };

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
