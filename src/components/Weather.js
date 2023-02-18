import spinner from "../images/spinner.gif"
import pin from "../images/pin.png"
import sun from "../images/sun.png"
import cloud from "../images/cloud.png"
import rain from "../images/rain.png"
import snow from "../images/snow.png"
import thunder from "../images/thunder.png"

function Weather (props) {
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const hour = new Date().getHours()

    const parseCode = (code, description = false) => {
        if (code <= 1) {
            return description ? "Clear Sky" : sun
        } else if (code <= 48) {
            return description ? "Cloudy" : cloud
        } else if (code <= 67) {
            return description ? "Rainy" : rain
        } else if (code <= 77) {
            return description ? "Snowy" : snow
        } else if (code <= 82) {
            return description ? "Rain Showers" : rain
        } else if (code <= 86) {
            return description ? "Snow Showers" : snow
        } else {
            return description ? "Thunderstorm" : thunder
        }
    }

    const convertTemp = (temp) => props.fer ? Math.round(temp * 1.8 + 32) : Math.round(temp);

    return (
        <>
            {props.data !== null ?
            <div className="weather">
                <div className="main">
                    <p id="date">
                        {`${weekdays[new Date().getDay()]}, ${months[new Date().getMonth()]} ${new Date().getDate()}`}
                    </p>
                    <p id="temp">
                        {convertTemp(props.data.hourly_temp[0])}°
                    </p>
                    <p id="location">
                        <img src={pin} alt="pin" />{props.data.name}
                    </p>
                    <p id="desc">
                        {parseCode(props.data.hourly_code[0], true)}
                    </p>
                    <div id="graphic">
                        <img src={parseCode(props.data.hourly_code[0])} alt="weather" />
                        <ul id="details">
                            <li>Humidity: {props.data.humidity}%</li>
                            <li>Wind Speed: {props.data.wind}m/s</li>
                        </ul>
                    </div>
                </div>
                <div className="side">
                    <div id="daily">
                        {props.data.daily_code.map((ele, i) => {
                            return (
                                <div key={i} className="day">
                                    <p id="name">
                                        {weekdays[(new Date().getDay() + i + 1) % weekdays.length]}
                                    </p>
                                    <img src={parseCode(ele)} alt="daily weather" />
                                    <p id="daily_temp">
                                        {convertTemp(props.data.daily_temp_max[i])}°/{convertTemp(props.data.daily_temp_min[i])}°
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                    <div id="hourly">
                        {props.data.hourly_code.slice(1).map((ele, i) => {
                            return (
                                <div key={i} className="hour">
                                    <p id="time">
                                        {`${(hour + i + 1) % 24 > 9 ? (hour + i + 1) % 24 : "0" + (hour + i + 1) % 24}:00`}
                                    </p>
                                    <img src={parseCode(ele)} alt="hourly weather" />
                                    <p id="hourly_temp">
                                        {convertTemp(props.data.hourly_temp[i + 1])}°
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            :
            <div className="loading">
                <img src={spinner} alt="Loading" />
            </div> }
        </>
    );
}

export default Weather;