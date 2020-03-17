import React, {useEffect, useState} from 'react';
import './App.css';
import axios from 'axios';
import Liste from "./Liste";
import Evolution from "./Evolution";

function App() {
  //const[latestDeaths, setLatestDeaths] = useState('Loading...');
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
  //let jsxList = <Liste nombre={numberOfCountry} />;

  /*let jsxList = data.map((p,index) => <Liste
      id={index}
      number={numberOfCountry}
      country={p.country}
      province={p.province}
  />);*/

  for(let i =0;i<numberOfCountry;i++){
    jsxList.push(<Liste
        id={i}
        number={numberOfCountry}
        country={data.locations[i].country}
        province={data.locations[i].province}
        actualiser={e=>actualiser()}
    />)
  }

  if(evolutionFranceDeaths.length == evolutionFranceConfirmed.length && evolutionFranceConfirmed.length >= 52){
    jsxEvolutionFrance.push(evolutionFranceConfirmed.map((p,index) => <Evolution
        date={p.date}
        number={p.number}
        key={index}
        deaths={evolutionFranceDeaths[index].number}
    />));
  }

  let jsxEvolutionFranceConfirmed = evolutionFranceConfirmed.map((p,index) => <Evolution
      date={p.date}
      number={p.number}
      key={index}
      //deaths={evolutionFranceDeaths.number}
    />);

  let jsxEvolutionFranceDeaths = evolutionFranceDeaths.map((p,index) => <Evolution
      date={p.date}
      number={p.number}
      key={index}
      //deaths={evolutionFranceDeaths.number}
  />);


  async function getLatestDeaths(nb) {
    const data = (await axios.get('https://coronavirus-tracker-api.herokuapp.com/deaths')).data;
    //setLatestDeaths(data.latest);
    setData(data);
    setDataFrance(data.locations[nb]);
    //console.log(data.locations[159]);
    setNumberOfCountry(data.locations.length);
    setLastUpdate(data.last_updated);
    //console.log(lastUpdate);

    setDataFranceDeaths(data.locations[nb]);
    console.log(data.locations[nb].history);
    let object=data.locations[nb].history;

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
      let finaldate =day + '/'+ month + '/' +year;
      tabInOrder[i].date = finaldate;
      tabInOrder[i].key=id;
      id++;
    }
    setEvolutionFranceDeaths(tabInOrder);
    console.log(tabInOrder);
    //for(let i=0;i<tabInOrder.length;i++){
      //setDataFranceDeaths(dataFranceDeaths.push(tabInOrder[i].number));
    //}
    console.log(dataFranceDeaths);
    setIsLoadingDeaths(true);
  }

  async function getLatestConfirmed(nb) {
    const data = (await axios.get('https://coronavirus-tracker-api.herokuapp.com/confirmed')).data;
    setDataConfirmed(data);
    setDataFranceConfirmed(data.locations[nb]);
    setLastUpdate(data.last_updated);
    //console.log(data.locations[159].history);
    let object=data.locations[nb].history;

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
      let finaldate =day + '/'+ month + '/' +year;
      tabInOrder[i].date = finaldate;
      tabInOrder[i].key=id;
      id++;
    }
    setEvolutionFranceConfirmed(tabInOrder);
    //console.log(tabInOrder);
    setIsLoadingConfirmed(true);
  }


  useEffect(() => {
    getLatestDeaths(157);
    getLatestConfirmed(157);
  },[]);

  function actualiser(e) {
    let nb = e.target.options[e.target.selectedIndex].id;
    setActualCountry(e.target.options[e.target.selectedIndex].value);
    getLatestDeaths(nb);
    getLatestConfirmed(nb);

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
            <tr>
              <td>World :</td>
              <td>{data.latest}</td>
            </tr>
            <tr>
              <td>{actualCountry} :</td>
              <td>{dataFrance.latest}</td>
            </tr>
          </table>

          <h2>Confirmed Cases :</h2>

          <table>
            <tr>
              <td>World :</td>
              <td>{dataConfirmed.latest}</td>
            </tr>
            <tr>
              <td>{actualCountry} :</td>
              <td>{dataFranceConfirmed.latest}</td>
            </tr>
          </table>

          <h2>Increasing stats in
            <select onChange={e=>actualiser(e)}>
              {jsxList}
            </select>
          </h2>
          <table>
            <tbody>
            <tr>
              <td>Date</td>
              <td>Confirmed cases</td>
              <td>Deaths</td>
            </tr>
            {jsxEvolutionFrance}
            </tbody>
          </table>
        </div>
    );
  }
}

export default App;
