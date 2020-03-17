import React from 'react';

function Liste(props) {
    if(!props.province){
        return (
            <option key={props.id} id={props.id} value={props.country} onClick={props.actualiser}>{props.country}</option>
        );
    }else{
        if(props.country==='France' && props.province==='France'){
            return (
                <option key={props.id} id={props.id} value={props.country+props.province} onClick={props.actualiser} selected>{props.country} ({props.province})</option>
            );
        }else{
            return (
                <option key={props.id} id={props.id} value={props.country +' ('+props.province+')'} onClick={props.actualiser}>{props.country} ({props.province})</option>
            );
        }
    }

}

export default Liste;
