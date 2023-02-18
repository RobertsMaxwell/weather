import { useEffect, useState } from "react";
import search_white from "../images/search-white.png"

function Header (props) {
    const [inputFocus, setInputFocus] = useState(false)
    const [resultFocus, setResultFocus] = useState(false)
    const [query, setQuery] = useState("")
    const [message, setMessage] = useState("")
    const [results, setResults] = useState(null)

    useEffect(() => {
        setResults(null)

        if(query.length === 0) {
            setMessage("Start typing to show results")
            return
        } else if(query.length < 3)
        {
            setMessage("Query too short")
            return
        }

        setMessage("Fetching...")
        const queryTimeout = setTimeout(() => {
            fetch(`https://api.geoapify.com/v1/geocode/autocomplete?type=city&text=${query}&apiKey=ac38edbeb3534f93988493ffbaf76f6f`)
            .then(response => response.json())
            .then(data => {
                let included = []
                const res = data.features.map(ele => {
                    const tmp = {
                        city: ele.properties.city,
                        state: ele.properties.state,
                        country: ele.properties.country,
                        abbreviation: ele.properties.country_code.toUpperCase(),
                        lat: ele.properties.lat,
                        lon: ele.properties.lon
                    }

                    if(!included.includes(tmp.city + tmp.state + tmp.country))
                    {
                        included.push(tmp.city + tmp.state + tmp.country)
                        return tmp
                    } else
                    {
                        return null
                    }
                })
                setResults(res.filter(ele => ele !== null))
            })
        }, 1500)

        return () => {
            clearTimeout(queryTimeout)
        }
    }, [query])

    return (
        <div className="header">
            <div className={`search_container ${inputFocus ? "input_focused" : ""}`}>
                <input type="text" value={query} onChange={e => {setQuery(e.target.value)}} placeholder="Search for a city..." onFocus={() => {setInputFocus(true)}} onBlur={() => {setInputFocus(false)}} />
                <img src={search_white} alt="search icon" />
            </div>
            <div className="switcher_container">
                <div className="group">
                    <div className={`switch ${props.fer ? "active" : "inactive"}`} onClick={() => {props.setFer(!props.fer)}}>
                        <div className="ball">
                        </div>
                    </div>
                    <p>{props.fer ? "F°" : "C°"}</p>
                </div>
            </div>
            {inputFocus || resultFocus ?
            <ul className="popup" onMouseEnter={() => {setResultFocus(true)}} onMouseLeave={() => {setResultFocus(false)}}>
                {results ? results.map((ele, i) => <li onClick={() => {
                    setQuery("")
                    setResultFocus(false)
                    props.setLocation({lat: String(ele.lat), lon: String(ele.lon), name: `${ele.city}${ele.state ? `, ${ele.state}` : ""}${ele.abbreviation ? `, ${ele.abbreviation}` : ""}`})
                }} key={i} className="entry">{`${ele.city}${ele.state ? `, ${ele.state}` : ""}${ele.country ? `, ${ele.country}` : ""}`}</li>)
                : <li onClick={() => {setResultFocus(false)}}>{message}</li>}
            </ul>
            :
            <></> }
        </div>
    );
}

export default Header;