import React, { useState } from "react";
import multiavatar from "@multiavatar/multiavatar";

export default function ProfileAvatar(){
    const [data, setData] = useState<string>(multiavatar("default"));

    const getImgSource = () => {
        let blob = new Blob([data], {type: 'image/svg+xml'});
        let url = URL.createObjectURL(blob);
        return url;
    }

    const handleGenerate = (e: React.MouseEvent<HTMLButtonElement>) => {
        let r:string = Math.random().toString(36).substring(8);
        setData(multiavatar(r));
    }

    return <div>
        <img src={getImgSource()} style={{width: "100px", height: "100px", display: "block"}} alt=""/>
        <button onClick={handleGenerate}>Generate</button>
    </div>
}