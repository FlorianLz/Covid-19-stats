import React from 'react';

function Liste(props) {
    if(!props.province){
        if(props.country==='France'){
            return (
                <option key={props.id} id={props.id} value={props.country} onClick={props.actualiser} selected>{props.country}</option>
            );
        }else{
            return (
                <option key={props.id} id={props.id} value={props.country} onClick={props.actualiser}>{props.country}</option>
            );
        }
    }else{
        return (
            <option key={props.id} id={props.id} value={props.country +' ('+props.province+')'} onClick={props.actualiser}>{props.country} ({props.province})</option>
        );
    }

}

export default Liste;
