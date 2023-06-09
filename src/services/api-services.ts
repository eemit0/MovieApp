import axios from "axios"
import  {  API_KEY, ENDPOINTS, TMDB_API_KEY }  from "../constants/utilities";
import AsyncStorage from "@react-native-async-storage/async-storage";




/* METHODS GET/POST/DELETE FROM TMDB API */

// Get method for trending movie
export const  getTrendingmovie = async():Promise<TMovieType[]> => {
    const data = await axios.get(ENDPOINTS.GET_TRENDING,{responseType:'json'}).then((response)=>{
        return response.data.results
    })
    return data
}

export const getMovieType = async (movieType:string):Promise<TMovieType[]>=>{
 
const data = await axios.get(`${ENDPOINTS.GET_MOVIETYPE}${movieType}?api_key=${API_KEY}`,{responseType:'json'}).then((response)=>{
    return response.data.results;
})
return data
}

// Get method that fetch details of the movie
export const getMovieDetails = async (id:number | undefined):Promise<IMovieDetail> => {
    const params = {
        append_to_response:"watch/providers,videos,recommendations"
    }
    const url = `${ENDPOINTS.GET_DETAILS}${id}?${TMDB_API_KEY}`
    const data = await axios.get(url,{params:params,responseType:"json"}).then((res)=>{
        return res.data
    })
    return data

}

// GET method to fetch genre of all movies
export const getGenreMovie = async ():Promise<TGenre[]> => {
    const resGenre = await axios.get(ENDPOINTS.GET_GENRES, {
            responseType: "json",
          })
          .then((response)=> {
            return response.data.genres;
          });
    return resGenre;
}
/* Get request token*/
export const createRequestToken = async  (): Promise<TResponseToken> => {
   const data:TResponseToken =  (await Promise.resolve(axios.get<TResponseToken>(ENDPOINTS.CREATE_REQUEST_TOKEN,{responseType:"json"}))).data
        return data;
} 
/* create new session */
export const createNewSession = async(token:string): Promise<TSession> => {
    //let requestToken = createRequestToken()
    console.log("token for session",token)
    let current_Session:TSession  = {
        success: false,
        session_id: ""
    }

    let requestBody = {
         
        "request_token": token
    }
 
    const options = {
        method: 'POST',
        url: ENDPOINTS.CREATE_SESSION,
        headers: {
            'content-type': 'application/json',
        },
        data: requestBody       
        
    };
   
   await axios.request(options)
    .then( (response)=> {
        current_Session = response.data
    })
    .catch( (error) =>{
        console.error("error",error);
    });

    return current_Session
     
 }
 export const deleteSession =async (session_Id:string) => {

    const responseToken:IResponseTokenMerge =   await AsyncStorage.getItem('responseToken').then((value) => {

        const data = JSON.parse(value as string)
        return  data
    })
    try {
        if(responseToken.session_id === session_Id){
            const options = {
                method: 'DELETE',
                url: 'https://api.themoviedb.org/3/authentication/session',
                headers: {
                  accept: 'application/json',
                  'content-type': 'application/json',
                  Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjOGRkNDFhZTYwOTIwMGE0YzlhZWYyNWU5NjU0NDk0YSIsInN1YiI6IjY0MjIzMGJhYzdhN2UwMDBhMzdiNjM0OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IvePC5OYOyxp1GySYiPFDgDeBIt-01c7kM0pfNKG8jM'
                },
                data: {session_id: responseToken.session_id}
              };
              axios
              .request(options)
              .then(function (response) {
                console.log(response.data);
              })
              .catch(function (error) {
                console.error(error);
              });
        }
        
    } catch (error) {
        console.log(error)
    }

      
    
    
 }
 /* Session with log In  */
export const sessionWithLogIn = async (username:string,password:string):Promise<boolean> => {
             let isAuthenticated = false;
      
            const requestToken: TResponseToken  = await createRequestToken()
            if( requestToken.success===true){
              const token = requestToken.request_token
                console.log("token",token)
                let requestBody = {
                    "username":username.toLowerCase(),
                    "password":password,
                    "request_token":token 
                }
                const options = {
                    method: 'POST',
                    url: ENDPOINTS.CREATE_SESSION_WITH_LOGIN,
                    headers: {
                        'content-type': 'application/json',
                    },
                    data: requestBody       
                    
                };
               
            await axios.request(options)
                .then( async   (response)=>{
                 await AsyncStorage.multiSet([["responseToken",JSON.stringify(response.data)],
                                             ["requestBody",JSON.stringify(requestBody)]])
        
                 isAuthenticated =response.data.success
        
                })
                .catch( (error)=> {
                    console.error("error",error);
                    isAuthenticated = false
        
                });
                    
            // create session right away
            let session = await createNewSession(token)
            if(session.success){
                console.log(session)
                AsyncStorage.mergeItem("responseToken",JSON.stringify(session))  
                isAuthenticated  = true
            }
            else  {
                console.log("cannot create session!!")    
            }
            isAuthenticated = true
        }
   
    return isAuthenticated;
    
 }

 export const getAccountState = async (id:number|undefined):Promise<IAccountState> => {

    let current_Session:IResponseTokenMerge = {
        success: false,
        request_token:"",
        expires_at:"",
        session_id: ""
    }
   
     await AsyncStorage.getItem('responseToken').then((value) => {

        const data = JSON.parse(value as string)
        current_Session = data
    })
    const params = {
        session_id:current_Session.session_id}
      
    const data  = await axios.get(
        `${ENDPOINTS.GET_ACCOUNT_STATE}${id}/account_states?${TMDB_API_KEY}`,{
            headers: { Accept:'application/json',"Content-Type": "application/json; charset=UTF-8" }
            ,params:params}).then((response)=>{
          let  responseData = response.data
       

          return responseData
            
        })
        //to do --> need to compile it as 
        
        return data;


 }


 export const getAccountDetails =async():Promise<IResponseAccount>=> {
    let current_Session:IResponseTokenMerge = {
        success: false,
        request_token:"",
        expires_at:"",
        session_id: ""
    }
    await AsyncStorage.getItem('responseToken').then((value) => {

        const data = JSON.parse(value as string)
        current_Session = data
      

    })
    const params = {
        session_id:current_Session.session_id}
      
    const data  = await axios.get(ENDPOINTS.GET_ACCOUNT,{
            headers: { Accept:'application/json',"Content-Type": "application/json; charset=UTF-8" }
            ,params:params}).then((response)=>{
          return response.data
            
        })
        
        return data;

 }

 

// POST method for adding watchlist
export const setWatchlist =async (movie:IMovieDetail | TMovieType |undefined,value:boolean):Promise<IWatchListResponse> => {
    //need body request
    let response:IWatchListResponse = {
        status_code :0,
        status_message:"",
        success: true
    }

    let current_Session:IResponseTokenMerge = {
        success: false,
        request_token:"",
        expires_at:"",
        session_id: ""
    }
     await AsyncStorage.getItem('responseToken').then((value) => {

        const data = JSON.parse(value as string)
        current_Session = data
    })
    
        let requestBody = {
            "media_type":"movie",
            "media_id":movie?.id,
            "watchlist":value 
        }
        const options = {
            method: 'POST',
            url: ENDPOINTS.ADD_WATCHLIST,
            params:{'session_id':current_Session.session_id },
            headers: {
                Accept : 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            data: requestBody       
            
        };
      
       await axios.request(options)
        .then((response)=>{
            response = response.data
           
        })
        .catch((error)=> {
            console.error("error",error);
    
        });
       
        return response
   
}
// Get movie watchlist
export const getMovieWatchlist = async ():Promise<TMovieType[]> => {
    let current_Session:IResponseTokenMerge = {
        success: false,
        request_token:"",
        expires_at:"",
        session_id: ""
    }
   

     await AsyncStorage.getItem('responseToken').then((value) => {

        const data = JSON.parse(value as string)
        current_Session = data
    })
    const params = {
        session_id:current_Session.session_id}
      
    const data  = await axios.get(
        ENDPOINTS.GET_WATCHLIST,{
            headers: { Accept:'application/json',
            "Content-Type": "application/json; charset=UTF-8" }
            ,params:params}).then((response)=>{
          return response.data.results
            
        })        
        return data;
}
// POST method for rate movie by Id
export const postRatingbyId = async (id:number|undefined,rateValue:number):Promise<IRating> =>{
    let responseRating:IRating ={
        success:false,
        status_code:0,
        status_message:"success",
    }
    let current_Session:IResponseTokenMerge = {
        success: false,
        request_token:"",
        expires_at:"",
        session_id: ""
    }
   

     current_Session =  await AsyncStorage.getItem('responseToken').then((value) => {

        const data = JSON.parse(value as string)
        return data
    })
    const params = {
        session_id:current_Session.session_id}
    let requestBody = {
      value:rateValue
    }
    const options = {
        method: 'POST',
        url: `${ENDPOINTS.RATE_MOVIES}${id}/rating?${TMDB_API_KEY}`,
        params:params,
        headers: {
            'content-type': 'application/json',
        },
        data: requestBody       
        
    };
   
   await axios.request(options)
    .then((response) =>{
        responseRating =response.data
         
    })
    .catch((error) =>{
        console.error("error",error);

    });
    return responseRating
}

// DELETE method for rate movie by Id
export const deleteRatingbyId = async (id:number|undefined,rateValue:number):Promise<IRating> =>{
    let responseRating:IRating ={
        success:false,
        status_code:1,
        status_message:"success",
    }
    let current_Session:IResponseTokenMerge = {
        success: false,
        request_token:"",
        expires_at:"",
        session_id: ""
    }
    current_Session= await AsyncStorage?.getItem('responseToken').then((value) => {

        const data = JSON.parse(value as string)
         return data
    })
    const params = {
        session_id:current_Session.session_id}
    let requestBody = {
      value:rateValue
    }
    const options = {
        method: 'DELETE',
        url: `${ENDPOINTS.RATE_MOVIES}${id}/rating?${TMDB_API_KEY}`,
        params:params,
        headers: {
            'content-type': 'application/json',
        },
        data: requestBody       
        
    };
   await axios.request(options)
    .then((response)=> {
        console.log("response from session login",response.data.success);
        responseRating =response.data
        

    })
    .catch((error)=> {
        console.error("error",error);

    });
    return responseRating
}

//Get method to retrieve movie review by its ID

export const getReviewById = async (id:number | undefined) => {
  

    const url = `${ENDPOINTS.GET_REVIEWS_BY_ID}${id}/reviews?${TMDB_API_KEY}`
    let data:IResultReview[] = await axios.get(url,{responseType:"json"}).then((res)=>{
        return res.data.results
    })
    return data

}

