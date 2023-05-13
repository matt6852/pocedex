import { createSlice } from "@reduxjs/toolkit";
import { fetchPokemons, fetchPokemonsByType, fetchTypes, searchPokemonByName } from "../service/pokemonsService";


const initialState ={
 count:0,
 results:[],
 currentPage:1,
 offset:0,
 limit:10,
 loading:false,
 error:null,
 serchTerm:"",
 types:[],
 selected:null
}
const pokemonsSlice =createSlice({
 name:"pokemons",
 initialState,
 reducers:{
  changePage(state,action){
   state.currentPage = action.payload
   state.offset = (state.currentPage -1) * state.limit 
  },
  changeLimit(state,action){
   state.limit = action.payload
  },
  selectedPokemon(state,action){
   state.selected = action.payload
  },
  onSearch(state,action){
   state.serchTerm = action.payload
  }
 },
 extraReducers(builder){
  builder.addCase(fetchPokemons.pending,(state,)=>{
   state.loading = true
  })
  builder.addCase(fetchPokemons.rejected,(state,action)=>{
   state.loading = false
   state.count = 0
   state.results = []
      //@ts-ignore
   state.error = action.payload.error
  })
  builder.addCase(fetchPokemons.fulfilled,(state,action)=>{
   state.loading = false
   state.count = action.payload.count
      //@ts-ignore
   state.results = action.payload.results
  })
  builder.addCase(fetchTypes.fulfilled,(state,action)=>{
  state.types = action.payload
  })
  builder.addCase(fetchTypes.rejected,(state,)=>{
  state.types = []
  })
  builder.addCase(fetchPokemonsByType.pending,(state,)=>{
   state.loading = true

  })
  builder.addCase(fetchPokemonsByType.rejected,(state,action)=>{
   state.count = 0
   state.results = []
   state.currentPage =1
   state.offset =0
   state.limit = 10
      //@ts-ignore
   state.error = action.payload.error
  })
  builder.addCase(fetchPokemonsByType.fulfilled,(state,action)=>{
   state.loading = false
   state.count = action.payload.count
   state.currentPage =1
   state.offset =0
   state.limit = 10
      //@ts-ignore
   state.results = action.payload.results
  })
  builder.addCase(searchPokemonByName.fulfilled,(state,action)=>{
   console.log(action);
   
   state.loading = false
      //@ts-ignore
   state.count = action.payload.count
   state.currentPage =1
   state.offset =0
   state.limit = 10
      //@ts-ignore
   state.results = action.payload.results
  })
  builder.addCase(searchPokemonByName.pending,(state,)=>{
   state.loading = false
  
  })
  builder.addCase(searchPokemonByName.rejected,(state,action)=>{
   console.log(action);
   state.count = 0
   state.results = []
   state.currentPage =1
   state.offset =0
   state.limit = 10
   state.serchTerm = ""
      //@ts-ignore
   state.error = action.error.message 
  })
 }
})
 export const {changePage,changeLimit,selectedPokemon,onSearch} = pokemonsSlice.actions
export default pokemonsSlice.reducer