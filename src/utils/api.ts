import axios, { isAxiosError } from "axios"

const OPENWEATHER_API_KEY = '7d6a15edadf6d08319604577b86b9931'

export const getWeather = async (lat:string,lon:string)=>{
    try {
        const APIEndpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&lang=id&units=metric`
    
        const response = await axios.get(APIEndpoint)

        if(response.status === 200) return response.data
        
    } catch (err) {
        if(isAxiosError(err)){
            console.log(err)
            return err
        }
    }
}

export const getCoordinatesByCity = async (query:string)=>{
    try {
        const APIEndpoint = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=7d6a15edadf6d08319604577b86b9931`
    
        const response = await axios.get(APIEndpoint)

        if(response.status === 200) return response.data
    } catch (err) {
        if(isAxiosError(err)){
            console.log(err)
            return err
        }
    }
}