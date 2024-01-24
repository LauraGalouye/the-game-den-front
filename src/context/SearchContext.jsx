import { createContext, useState, useEffect} from "react";
import Loader from "../components/Loader/Loader";
import axios from 'axios'; 

export const SearchContext = createContext()

export const SearchController = ({children}) => {

    const [search, setSearch] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    
    const API_KEY = import.meta.env.VITE_API_KEY

    const fetchSearch = async (search) => {
        try{
            setIsLoading(true)
            const apiCall = await axios.get(`https://api.rawg.io/api/games?key=${API_KEY}&search=${search}&search_exact=true&ordering=-added&exclude_stores=9,8,4&parent_platforms=1,2,3,7&page_size=100`)
            
            const sortedResults = apiCall.data.results.sort((a, b) => {
                const releaseDateA = new Date(a.released).getTime() || 0;
                const releaseDateB = new Date(b.released).getTime() || 0;
                return releaseDateB - releaseDateA;
            });

            setSearch({ ...apiCall.data, results: sortedResults });
    
        } 
        catch (error){
            setError(error)
        }
        finally{
            setIsLoading(false)
        }
    }


    useEffect(() =>{
        fetchSearch()
    }, [])

    return(
        <SearchContext.Provider value={[search, setSearch, fetchSearch, isLoading, setIsLoading]}>
            {isLoading ? ( <Loader />) : (children)}
         </SearchContext.Provider>
     )

}