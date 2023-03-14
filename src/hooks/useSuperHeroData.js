import { useQuery, useQueryClient } from 'react-query'
import axios from 'axios'

const fetchSuperHero = ({ queryKey }) => {
  const heroId = queryKey[1]
  return axios.get(`http://localhost:4000/superheroes/${heroId}`)
}

export const useSuperHeroData = heroId => {
  const queryClient = useQueryClient()
  return useQuery(['super-hero', heroId], fetchSuperHero, {
    initialData: () => { //we use this to intial data by caching data in query client , not stop fetching data in background 
      const hero = queryClient
        .getQueryData('super-heroes')
        ?.data?.find(hero => hero.id === parseInt(heroId)) // our way to get data from client query  
      if (hero) {
        return { data: hero }
      } else {
        return undefined //undefined make useQuery to refetch data and be in loading mood 
      }
    }
  })
}