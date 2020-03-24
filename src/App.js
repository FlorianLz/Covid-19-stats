import React, {useEffect, useState} from 'react';
import './App.css';
import axios from 'axios';
import Liste from "./Liste";
import Evolution from "./Evolution";

function App() {
  const[numberOfCountry, setNumberOfCountry] = useState(0);
  const[data, setData] = useState([]);
  const[dataConfirmed, setDataConfirmed] = useState([]);
  const[dataFrance, setDataFrance] = useState([]);
  const[dataFranceConfirmed, setDataFranceConfirmed] = useState([]);
  const[dataFranceDeaths, setDataFranceDeaths] = useState([]);
  const[lastUpdate,setLastUpdate] = useState(0);
  const[evolutionFranceConfirmed,setEvolutionFranceConfirmed] = useState([]);
  const[evolutionFranceDeaths,setEvolutionFranceDeaths] = useState([]);
  const[actualCountry,setActualCountry] = useState('France');
  const[isLoadingDeaths,setIsLoadingDeaths] = useState(false);
  const[isLoadingConfirmed,setIsLoadingConfirmed] = useState(false);
  const[idFrance,setIdFrance] = useState(0);

  let jsxList=[];
  let jsxEvolutionFrance=[];

  let thedate=new Date (lastUpdate);
  let day=thedate.getDate();
  let month=thedate.getMonth()+1;
  if(month<10){
    month='0'+month;
  }
  if(day<10){
    day='0'+day;
  }

  let jsxDate =day + '/'+ month + '/' +thedate.getFullYear()+ ' - '+ thedate.getHours()+'h'+ thedate.getMinutes();


  for(let i =0;i<numberOfCountry;i++){
    jsxList.push(<Liste
        key={i}
        id={i}
        number={numberOfCountry}
        country={data.locations[i].country}
        province={data.locations[i].province}
        actualiser={e=>actualiser()}
    />)
  }

  if(evolutionFranceDeaths.length === evolutionFranceConfirmed.length && evolutionFranceConfirmed.length >= 52){
    jsxEvolutionFrance.push(evolutionFranceConfirmed.map((p,index) => <Evolution
        date={p.date}
        number={p.number}
        key={index}
        deaths={evolutionFranceDeaths[index].number}
    />));
  }

  async function getLatestDeaths(nb,first) {
    const data = (await axios.get('https://coronavirus-tracker-api.herokuapp.com/deaths')).data;
    setData(data);
    setNumberOfCountry(data.locations.length);
    setLastUpdate(data.last_updated);

    if(first===true){
      for(let i=0;i<data.locations.length;i++){
        if(data.locations[i].country === 'France' && data.locations[i].province === ''){
          setIdFrance(i);
          setDataFrance(data.locations[i]);
          setDataFranceDeaths(data.locations[i]);
          let object=data.locations[i].history;
          end(object);
        }
      }
    }else{
      setDataFrance(data.locations[nb]);
      setDataFranceDeaths(data.locations[nb]);
      let object=data.locations[nb].history;
      end(object);
    }

    function end(object){
      let tab = [];
      for (let key in object) {
        let obj = {};
        obj["date"] = key;
        obj["number"] = object[key];
        tab.push(obj);
      }
      let tabInOrder = tab.sort((a, b) => new Date(b.date) - new Date(a.date)).reverse();
      let id=0;
      for(let i=0;i<tabInOrder.length;i++){
        let thedate=new Date (tabInOrder[i].date);
        let day = thedate.getDate();
        let month = thedate.getMonth()+1;
        let year = thedate.getFullYear();
        if(month<10){
          month='0'+month;
        }
        if(day<10){
          day='0'+day;
        }
        tabInOrder[i].date = day + '/'+ month + '/' +year;
        tabInOrder[i].key=id;
        id++;
      }
      setEvolutionFranceDeaths(tabInOrder);
      setIsLoadingDeaths(true);
    }
  }

  async function getLatestConfirmed(nb,first) {
    const data = (await axios.get('https://coronavirus-tracker-api.herokuapp.com/confirmed')).data;
    setDataConfirmed(data);
    setLastUpdate(data.last_updated);

    if(first===true){
      for(let i=0;i<data.locations.length;i++){
        if(data.locations[i].country === 'France' && data.locations[i].province === '') {
          setIdFrance(i);
          setDataFranceConfirmed(data.locations[i]);
          let object = data.locations[i].history;
          end(object);
        }
      }
    }else{
      setDataFranceConfirmed(data.locations[nb]);
      let object=data.locations[nb].history;
      end(object);
    }

    function end(object){
      let tab = [];
      for (let key in object) {
        let obj = {};
        obj["date"] = key;
        obj["number"] = object[key];
        tab.push(obj);
      }
      let tabInOrder = tab.sort((a, b) => new Date(b.date) - new Date(a.date)).reverse();
      let id=0;
      for(let i=0;i<tabInOrder.length;i++){
        let thedate=new Date (tabInOrder[i].date);
        let day = thedate.getDate();
        let month = thedate.getMonth()+1;
        let year = thedate.getFullYear();
        if(month<10){
          month='0'+month;
        }
        if(day<10){
          day='0'+day;
        }
        tabInOrder[i].date = day + '/'+ month + '/' +year;
        tabInOrder[i].key=id;
        id++;
      }
      setEvolutionFranceConfirmed(tabInOrder);
      setIsLoadingConfirmed(true);
    }


  }


  useEffect(() => {
    getLatestDeaths(0,true);
    getLatestConfirmed(0,true);
  },[]);

  function actualiser(e) {
    let nb = e.target.options[e.target.selectedIndex].id;
    setActualCountry(e.target.options[e.target.selectedIndex].value);
    getLatestDeaths(nb,false);
    getLatestConfirmed(nb,false);

  }

  if(isLoadingDeaths === false && isLoadingConfirmed===false){
    return(
        <div className={"content"}>
          <div className="lds-roller">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
    );
  }else{
    return (
        <div className={'contenu'}>
          <div><img src={"logoblanc.png"} alt={"logo"}/>
            <h1>Covid-19 stats</h1></div>
          <h4>(Last check on {jsxDate})</h4>
          <h2>Deaths :</h2>

          <table>
            <tbody>
              <tr>
                <td>World :</td>
                <td>{data.latest}</td>
              </tr>
              <tr>
                <td>{actualCountry} :</td>
                <td>{dataFrance.latest}</td>
              </tr>
            </tbody>
          </table>

          <h2>Confirmed Cases :</h2>

          <table>
            <tbody>
              <tr>
                <td>World :</td>
                <td>{dataConfirmed.latest}</td>
              </tr>
              <tr>
                <td>{actualCountry} :</td>
                <td>{dataFranceConfirmed.latest}</td>
              </tr>
            </tbody>
          </table>

          <h2>Increasing stats in
            <select onChange={e=>actualiser(e)}>
              {jsxList}
            </select>
          </h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Confirmed cases</th>
                <th>Deaths</th>
              </tr>
            </thead>
            <tbody>
              {jsxEvolutionFrance}
            </tbody>
          </table>
        </div>
    );
  }
}

export default App;
