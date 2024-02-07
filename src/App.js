import './App.css';
import React, { useState, useEffect } from 'react';
import ApiCalendar from "react-google-calendar-api";
import Countdown, {zeroPad} from 'react-countdown';
const config = {
	clientId: process.env.REACT_APP_CLIENT_ID,
	apiKey: process.env.REACT_APP_API_KEY,
	scope: "https://www.googleapis.com/auth/calendar",
	discoveryDocs: [
	  	"https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
	],
};
  
const apiCalendar = new ApiCalendar(config);

//favicon functs from https://www.enhanceie.com/test/favicon/dynamic.htm
const removeFavicon = () => {
	var links=document.getElementsByTagName('link');
	var head=document.getElementsByTagName('head')[0];
	for(var i = 0; i < links.length; i++) {
		if(links[i].getAttribute('rel')==='icon') {
			head.removeChild(links[i])
		}         
	}      
}
const setFavicon = () => {
	var old = getFavicon().href;
	removeFavicon();
	var numIdx = old.indexOf("frame") + 5;
	var num = parseInt(old[numIdx]) + 1;
	if(num === 6) num = 0;
	var link=document.createElement('link');
	link.type='image/x-icon';
	link.rel='icon';
	link.href=old.substring(0, numIdx) + num + ".ico";
	document.getElementsByTagName('head')[0].appendChild(link);
	//console.log("Set FavIcon URL to " + getFavicon().href);
}
const getFavicon = () => {
	var links=document.getElementsByTagName('link');
	for(var i=0; i<links.length; i++) {
		if (links[i].getAttribute('rel') === 'icon'){
			return links[i];
		}       
	}
	return undefined;
}
const Animator = () => {
  	useEffect(() => {
		const timeoutId = setInterval(() => {setFavicon();}, 400);
    	return () => clearInterval(timeoutId);
  }, []);
   return;
}
const moveButton = (event) => {
	const left = Math.floor(Math.random() * (window.innerWidth - 50));
	const top = Math.floor(Math.random() * (window.innerHeight - 50));
	event.target.style.left = left+"px";
	event.target.style.top = top+"px";
	event.target.style.position = "absolute";
	document.getElementById("ghost").style.display = "initial";
}
const ouch = () => {
	console.log("rude >:(");
}

const App = () => {
	const [data, setData] = React.useState([]);
	const [state, setState] = React.useState([0,-1]);
	const dateStart = ['10 February 2024 11:30 PST', '17 February 2024 11:30 PST', '18 February 2024 11:30 PST'];
	const dateEnd = ['10 February 2024 17:30 PST', '17 February 2024 17:30 PST', '18 February 2024 17:30 PST'];
	const dates = ["02/10/2024", "02/17/2024", "02/18/2024"];
	const pageState = (event) => {
		const newPage = parseInt(event.target.getAttribute("newpage"));
		const newDate = (event.target.getAttribute("date")) ? parseInt(event.target.getAttribute("date")) : state[1];
		setState([newPage, newDate]);
	}
    React.useEffect(() => {
        fetch("https://broken-iodized-reaction.glitch.me/data")
        .then(res => res.json())
        .then(json => setData(json.dat));
    }, []);
    const changeValue = (event) => {
		const d = (event != null) ? -1 : state[1];
        fetch("https://broken-iodized-reaction.glitch.me/data", {
            method: "post",
            headers: {
				"d": d
            }
        })
            .then(res => res.json())
            .then(json => setData(json.dat))
    }
	const signIn = () => {
		apiCalendar
			.handleAuthClick()
			.then(() => {
				addEvent();
			})
			.catch((error) => {
				console.log(error);
			});
	}
	const addEvent = () => {
		const event = {
			summary: "pre-valentines date :)",
			description: "U+1F6FC",
			start: {
				dateTime: new Date(dateStart[state[1]]).toISOString(),
				timeZone: "America/Los_Angeles"
			},
			end: {
				dateTime: new Date(dateEnd[state[1]]).toISOString(),
				timeZone: "America/Los_Angeles"
			},
		};
		apiCalendar
			.createEvent(event)
			.then((result) => {
			  console.log(result);
			  window.location.href = "https://calendar.google.com/calendar/u/0/r/week/2024/2/" + ((state[1] + 1) * 7) + "?tab=rc";
			})
			.catch((error) => {
			  console.log(error);
			});
	}
	const renderer = ({days, hours, minutes, seconds, completed}) => {
  		if(completed) {
    		return <div id="countdown">♡♡♡</div>;
 		 } else {
   			return <div><div id="countdown">{days}:{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}</div><br/>til {dates[data.date]}</div>
		}
	};
	const showcal = data.fdate == data.date ? "" : "none";
	if(parseInt(data.date) > -1 && state[0] === 0) {
		return (
			<div>
				<Animator/>
				<button id="reset" onClick={changeValue}>reset web app?</button>
				<div id="center">
					<Countdown date={new Date(dateStart[data.fdate]).toISOString()} renderer={renderer}/>
				</div>
			</div>
		);
	} else {
		if(data.date === -1 && data.date !== state[1]) {changeValue()}
		if (state[0] === 5) {
			return (
				<div>
					<Animator/>
					<div id="center">
					damn :O maybe another time <img src={require(`./pensive.png`)} width="15px" height="15px" alt = ":("/>
					</div>
				</div>
			);
		} else if(state[0] === 4) {
			return (
				<div>
					<Animator/>
					<div id="center">
						bruh... <br/>
						the 18th?<br/><br/>
						<button onClick={pageState} newpage="2" date="2">yes</button>
						<button onClick={pageState} newpage="5">no :(</button>
					</div>
				</div>
			);
		} else if(state[0] === 3) {
			return (
				<div>
					<Animator/>
					<div id="center">
						hmm... ok <br/>
						what about 2/17? still 11:30 to 5:30 ofc<br/><br/>
						<button onClick={pageState} newpage="2" date="1">yes</button>
						<button onClick={pageState} newpage="4">no :(</button>
					</div>
				</div>
			);
		} else if(state[0] === 2) {
			return (
				<div>
					<Animator/>
					<div id="center">
						yayyy its a date :D<br/><br/>
						<button onClick={signIn} style={{display:showcal}}>add to google calendar?</button>
					</div>
				</div>
			);
		} else if(state[0] === 1) {
			return (
				<div>
					<Animator/>
					<div id="center">
						are you free 2/10, 11:30 to 5:30 (ish)?<br/><br/>
						<button onClick={pageState} newpage="2" date="0">yes</button>
						<button onClick={pageState} newpage="3">no :(</button>
					</div>
				</div>
			);
		} else {
			return (
				<div>
					<Animator/>
					<div id="center">
						will you be my valentine?<br/><br/>
						<button onClick={pageState} newpage="1">yes</button>
						<button id="ghost">no :(</button>
						<button id="no" onMouseEnter={moveButton} onClick={ouch}>no :(</button>
					</div>
				</div>
			);
		}
	}
}

export default App;




