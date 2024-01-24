import './GameDetails.scss';
import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { UserContext} from '../../context/UserContext';
import heart from '../../assets/heart.svg';
import solidHeart from '../../assets/solidHeart.svg';
import axios from 'axios';

const GameDetails = () => {

    const {id} = useParams();
    const {value1, value4, value6} = useContext(UserContext)
    const [details] = value1
    const [isAuthenticated] = value4
    const [favorites, setFavorites] = value6
    const [isFavoriteGame, setIsFavoriteGame] = useState(false)
    const [gameDetails, setGameDetails]= useState('')
    const [showFullDescription, setShowFullDescription]=useState(true)
    const userId=details.id;
    const API_KEY = import.meta.env.VITE_API_KEY
    const [isLoading, setIsLoading] = useState(false)


    const fetchGameDetails = async () => {

      try{
          setIsLoading(true)
          const gameId = id
          const apiCall = await axios.get(`https://api.rawg.io/api/games/${gameId}?key=${API_KEY}`)
          setGameDetails(apiCall.data)
          const currentGame = apiCall.data.id
          const isFavorite = await favorites.find((favorite) => favorite.GameID === currentGame)
          if (isFavorite) {
              setIsFavoriteGame(true)
          }else{
              setIsFavoriteGame(false)
          }
        } catch (err) {
            console.log(err)
        } finally{
            setIsLoading(false)
        }
    }

    useEffect(() => { fetchGameDetails()}, []);

    useEffect(() => {
      window.scrollTo(0, 0); 
    }, [gameDetails]);

    const handleToggleFavorite = async () => {
        const currentGame = { gameId : gameDetails.id, gameName : gameDetails.name, gameImage : gameDetails.background_image};
        if(!isAuthenticated) return(
            alert("You must be logged in to add a game to your favorites")
            );

        if (!isFavoriteGame) {
            await axios.post(`http://localhost:3000/api/users/${userId}/games`, currentGame);
            setFavorites((prevFavorites) => [...prevFavorites, currentGame]);
            setIsFavoriteGame(true);
          };

        if (isFavoriteGame) {
            await axios.delete(`http://localhost:3000/api/users/${userId}/games`, {data : currentGame});
            setFavorites((prevFavorites) => prevFavorites.filter((favorite) => favorite.gameId !== currentGame.gameId));
            setIsFavoriteGame(false);
        };
    };
    //page détail du jeu avec image en fond   

    return (
        <>
          
          <div className='game'>
            {gameDetails && gameDetails.background_image && <><img className="game__img" src={gameDetails.background_image} alt={gameDetails.name} /></>}
           
            <div className='game__information'>
            {gameDetails && gameDetails.name && <h1 className="game__title">{gameDetails.name}</h1>}
              <div className='game__information game__information--right'>
                <div className='game__information--box'>
                  <h2 className='game__information--box-title-right'>Platforms:</h2>
                  {gameDetails && gameDetails.parent_platforms && (
                    <div className='platforms__list'>
                      {gameDetails.platforms.map((platform) => (
                        <p key={platform.id} className="platforms__name">{platform.platform.name}</p>
                      ))}
                    </div>
                  )}
                </div>
                <div className='game__information--box'>
                  <h2 className='game__information--box-title-right'>Genres:</h2>
                  {gameDetails && gameDetails.genres && (
                  < div className='genres__list'>
                      {gameDetails.genres.map((genre) => (
                        <p key={genre.id} className="genres__name">{genre.name}</p>
                      ))}
                  </div>
                  )}
                </div>
              </div>
            
              <div className='game__information game__information--left'>
                <div className='game__information--box'>
                <h2 className='game__information--box-title'>Release date:</h2>
                  {gameDetails && gameDetails.released && (
                   <p className="game__release">{gameDetails.released}</p>
                  )}
                </div>
                <div className='game__information--box'> 
                  {gameDetails && gameDetails.publishers && (
                    <>
                      <h2 className='game__information--box-title'>Publishers:</h2>
                      {gameDetails.publishers.map((publisher) => (
                        <p key={publisher.id} className="game__publisher">{publisher.name}</p>
                      ))}
                    </>
                  )}
                </div>
                <div className='game__information--box'>
                  {gameDetails && gameDetails.developers && (
                    <>
                      <h2 className='game__information--box-title'>Developers:</h2>
                      {gameDetails.developers.map((developer) => (
                        <p key={developer.id} className="game__dev">{developer.name}</p>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>            
            {gameDetails && gameDetails.description_raw && 
            <p className="game__desc">
            {gameDetails.description_raw}
            </p>}
            {/* {!showFullDescription && (
              <button className="readmore-button" onClick={()=>setShowFullDescription(true)}>
              Read more
              </button>
            )}
            {showFullDescription && (
              <button className="readless-button" onClick={()=>setShowFullDescription(false)}>
              Read less
              </button>
            ) } */}
          </div>            
           {isFavoriteGame ? (<div onClick={handleToggleFavorite}><img className="heart-solid" src={solidHeart} /></div>)
           : (<div onClick={handleToggleFavorite}><img className="heart-outline" src={heart}/></div>)} 
        </>
    );
}      


export default GameDetails