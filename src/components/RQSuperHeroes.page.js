
import { useState } from 'react';
import { useAddSuperHeroesData, useSuperHeroesData } from '../hooks/useSuperHeroesData';

export const RQSuperHeroesPage = () => {


const [heroName,setHeroName]=useState("");
const [alterEgo,setAlterEgo]=useState("");

// const {mutate} =useAddSuperHeroesData();
const {mutate :addHero} =useAddSuperHeroesData();
const handelAddHero=()=>{
const hero ={name :heroName,alterEgo};
// mutate(hero);
addHero(hero);
}


const onSuccess=(data)=>{//Automatic Injects data inside success callback 
  console.log("log after fetching data ",data);
}
const onError=(error)=>{//Automatic Injects error message inside success callback 
  console.log("log after fetching data ",error);
}

 const {isLoading ,data ,isError,error,refetch}= useSuperHeroesData(onSuccess,onError);
  if (isLoading) {
    return <h2>Loading...</h2>
  }
  if (isError) {
    return <h2>{error?.message}</h2>
  }

  return (
    <>
      <h2>React Query Super Heroes Page</h2>
    


    <input type={'text'} value={heroName} onChange={(e)=> setHeroName(e.target.value)} />
    <input type={'text'} value={alterEgo} onChange={(e)=> setAlterEgo(e.target.value)} />
    <button onClick={handelAddHero}>Add hero </button>
      {/* useing select  */}
    {data?.map(heroName => {
        return <div key={heroName}>{heroName}</div>
      })}

      {/* {data?.data?.map(hero => {
        return <div key={hero.name}>{hero.name}</div>
      })} */}
    </>
  )

}
