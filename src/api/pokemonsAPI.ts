import axios from "axios";

const instance = axios.create({
 baseURL:"https://pokeapi.co/api/v2/"
})

export const pokemonAPI ={
 getPokemons(offset:number,limit:number,){  
  return instance.get(`pokemon?offset=${offset}&limit=${limit}`)
 },
 getTypes(){
  return instance.get(`type`)
 },
 getPokemonsByType(type:string){
  return instance.get(`type/${type}`)
 },
 getPokemonByName(name:string){
  return instance.get(`pokemon/${name}`)
 }
}