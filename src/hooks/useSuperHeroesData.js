
// Import Hook of useQuery 
import { useMutation, useQuery, useQueryClient } from "react-query"; // used for all data fetching needs 

// import axios from 'axios'
import { request } from "../utils/axios.utils";


const fetchSuperHeroes = () => {
  return request({url:'/superheroes'}); //by defult it get method
}


const addSuperHeroe = (hero) => {
  return request({url:'/superheroes',method:'post' ,data:hero});
}



export const useSuperHeroesData = (onSuccess, onError) => {
  return useQuery("super-heroes", fetchSuperHeroes, {
    // cacheTime:5000,// this line if i need to change time of caching 

    // staleTime:3000,// this to control time not refetch data a gain and appear old data

    //refetchOnMount:true,//this is control Refetching data while moumt " normal happen by defult" , if i make it always will refetch if stale or any state 
    //refetchOnWindowFocus:true,// this control refetch live if anydata changed, automatic updating and syncr with be " by defult true"

    // POLLING
    //refetchInterval:2000, // with refetch automatic not depend on mount ,by defult its false 

    // refetchIntervalInBackground:true,// will still refetching evenif you are not mount the ui 

    // refetch 
    //enabled:false, if w need to not fetch it when mount and just on condtion make it false and use refetch function to make it fetching  

    // callbacks : if i need to do sth when finish getching data 
    onSuccess: onSuccess,//use on success mood after fetching data or if data fetching and mount again //Automatic Injects data inside success callback 
    onError: onError,//when we hav an error while fetching .... query calling the function 3 time before callback onError ./Automatic Injects error message inside success callback 

    // Transformationv:if we want to take specific data and make array of it , like just list of heros names 
    select: (data) => {
      const superHeroesNames = data.data.map(hero => hero.name)
      return superHeroesNames;
    },//Function which automatically receives the api data as an argment  
  });// need at least 2 args , first unique key , second a function return a promise 


}
//this way when finish posting reftch again all super heros 
// export const useAddSuperHeroesData=()=>{
// const queryClient=useQueryClient();
//   // first Params the function will post the request 
// return useMutation(addSuperHeroe,{
//   onSuccess:()=>{
//     queryClient.invalidateQueries('super-heroes');//To make refetch after add new hero 
//   }
// })
// }

// this way to use response which come from posting to be added to our list 

// export const useAddSuperHeroesData = () => {
//   const queryClient = useQueryClient();
//   // first Params the function will post the request 
//   return useMutation(addSuperHeroe, {
//     onSuccess: (data) => {
//       // set query data update cached data  
//       queryClient.setQueriesData('super-heroes', (oldQueryData) => {
//         return {
//           ...oldQueryData,
//           data: [...oldQueryData.data, data.data],
//         }
//       })
//     }
//   })

// }

// Optimistic updates 
export const useAddSuperHeroesData = () => {
  const queryClient = useQueryClient();
  // first Params the function will post the request 
  return useMutation(addSuperHeroe, {
    onMutate: async (newHero) => {
      await queryClient.cancelQueries('super-heroes');
      const previousQueryData = queryClient.getQueryData('super-heroes');
      queryClient.setQueriesData('super-heroes', (oldQueryData) => {
        return {
          ...oldQueryData,
          data: [...oldQueryData.data, { id: oldQueryData?.data?.length + 1, ...newHero }],
        }
      })
      return {
        previousQueryData,

      }
    },
    onError: (_error, _hero, context) => {
      queryClient.setQueryData('super-heroes', context.previousQueryData);
    },
    onSettled: () => {
      queryClient.invalidateQueries('super-heroes')
    }
  })
}