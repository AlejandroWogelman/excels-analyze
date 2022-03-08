import { useEffect, useState } from "react";
import { read, utils } from "xlsx";

import "./app.css";

function App() {
  const [results, setresults] = useState([]);
  const [files, setFiles] = useState([]);

  const readExcel = async (e) => {
    const file = e.target.files[0];

    if (files.includes(file.name)) {
      return;
    }

    const data = await file.arrayBuffer();

    const workbook = read(data);

    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const jsonData = utils.sheet_to_json(worksheet);
    setFiles([...files, file.name]);

    handlerSearch(jsonData);
  };

  const handlerSearch = (data) => {
    const rename = data.map((val) => {
      const { ["User ID"]: id, Name: name } = val;
      return {
        points: counter(val),
        name,
        id,
      };
    });

    const newState = reduce(results.concat(rename));
    setresults(newState);

    /* filter(valuesConcat).then((d) => setresults(d)); */
  };

  const reduce = (rename) => {
    const objectArr = [
      { id: 2, name: "ale2", points: 4 },
      { id: 1, name: "ale1", points: 2 },
      { id: 3, name: "ale3", points: 4 },
      { id: 2, name: "ale2", points: 5 },
      { id: 5, name: "ale2", points: 1 },
    ];

    const filter = rename.reduce((acc, el) => {
      const search = acc.find((x) => el.id === x.id);
      const index = acc.indexOf(search);

      if (!search) {
        const result = [...acc, el];
        return result;
      } else {
        acc[index] = {
          ...el,
          points: acc[index].points + el.points,
        };

        return acc;
      }
    }, []);
    return filter;
  };
  const counter = (players) => {
    const {
      ["L2 (Hunt)"]: lv2,
      ["L3 (Hunt)"]: lv3,
      ["L4 (Hunt)"]: lv4,
      ["L5 (Hunt)"]: lv5,
    } = players;
    const nivel3 = lv3 * 3;
    const nivel2 = lv2 * 1;
    const nivel4 = lv4 * 8;
    const nivel5 = lv5 * 15;

    return nivel3 + nivel2 + nivel4 + nivel5;
  };

  const changeArrayOrder = (data) => {
    if (results.length < 1) {
      return;
    }
    let newValue;
    if (data === "cucas") {
      newValue = [...results].sort((a, b) => {
        if (a.points < b.points) {
          return -1;
        }
        if (a.points > b.points) {
          return 1;
        }
        return 0;
      });
    } else {
      newValue = [...results].sort((a, b) => {
        if (a.points > b.points) {
          return -1;
        }
        if (a.points < b.points) {
          return 1;
        }
        return 0;
      });
    }
    setresults(newValue);
  };

  const clear = () => {
    setresults([]);
    setFiles([]);
  };

  useEffect(() => {}, [results]);

  return (
    <div className="App">
      <header>
        <h1>ANALIZADOR DE EXCELS</h1>
      </header>
      <div className="input-container">
        <label htmlFor="file">Elige los Excel</label>

        <input
          type="file"
          id="file"
          name="one"
          onChange={(e) => readExcel(e)}
        />
      </div>
      <div className="btn-container">
        <button
          className="btn"
          onClick={() => changeArrayOrder("cucas")}
          type="button"
        >
          CUCAS
        </button>
        <button
          className="btn"
          onClick={() => changeArrayOrder()}
          type="button"
        >
          Mejores cazadores
        </button>
        <button className="btn clear" onClick={clear} type="button">
          Limpiar
        </button>
      </div>

      <section className="articles-container">
        {files.length > 0 &&
          files.map((el, i) => {
            return <article key={i}>{el}</article>;
          })}
      </section>
      <section className="section-hunters">
        {results.length > 0 &&
          results.map(({ name, id, points }, i) => {
            if (name === "Anonymous") {
              return;
            }
            return (
              <article key={i}>
                <p className={points < 5 * files.length && "danger"}>{name}</p>
                <span className="points">{points}</span>
              </article>
            );
          })}
      </section>
    </div>
  );
}

export default App;
