import './App.css';
import React, { useState, useEffect } from 'react';

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
	var num = parseInt(old.split('.')[0].substring(old.split('.')[0].length -1)) + 1;
	if(num === 6) num = 0;
	var link=document.createElement('link');
	link.type='image/x-icon';
	link.rel='icon';
	link.href=old.split('.')[0].substring(0, old.split('.')[0].length-1) + num + "." + old.split('.')[1];
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
		const timeoutId = setInterval(() => {setFavicon();}, 250);
    	return () => clearInterval(timeoutId);
  }, []);
  return;
}

const App = () => {
	return (
		<div className="App">
			<Animator/>
			
		</div>
	);
}

export default App;



