import { createAsyncThunk } from "@reduxjs/toolkit";
import { pokemonAPI } from "../api/pokemonsAPI";


export const fetchPokemons = createAsyncThunk("fetch/pokemons", async ({offset,limit}:any)=>{

 const result  = await pokemonAPI.getPokemons(offset,limit)
    //@ts-ignore
 const {next,previous,count} = result.data
 const combineResult = await Promise.all(result.data.results.map(async (p:any)=>{
  const res = await fetch(p?.url)
  const data = await res.json()
  return {...p,info:data}
 }))
 return {
  count,
  results:combineResult,
 }
})

export const fetchTypes = createAsyncThunk("fetch/pokemonsTypes",  async ()=>{
  const result = await pokemonAPI.getTypes()
  return result.data.results.map((type:any) =>({value:type.url,label:type.name}))
})
export const fetchPokemonsByType = createAsyncThunk("fetch/pokemonsByType",  async (type:string)=>{
  const result = await pokemonAPI.getPokemonsByType(type)
  const pokemons = await Promise.all(result.data.pokemon.map(async (p:any)=>{
   const res = await fetch(p.pokemon?.url)
   const data = await res.json()
   return {...p.pokemon,info:data}
  }))
  return {
   count:pokemons.length,
   results:pokemons
  }
})
export const searchPokemonByName = createAsyncThunk("fetch/pokemonByName",  async (name:string)=>{
  const result = await pokemonAPI.getPokemonByName(name)
  const pokemons = await Promise.all(result.data.forms.map(async (p:any)=>{
   const res = await fetch(p?.url)
   const data = await res.json()
   return {...p,info:data}
  }))
  return {
   count:pokemons.length,
   results:pokemons
  }
})