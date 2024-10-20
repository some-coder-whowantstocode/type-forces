import { createSlice } from '@reduxjs/toolkit'


export interface location{
    name:string,
    location:string
}

export interface pagesliceval{
    locations:location[],
    currentPage: number ,
    prevPage: number 
}

const initialState : pagesliceval = {
    locations: [
        { name: 'compete', location: '/compete' },
        { name: 'practice', location: '/practice' },
        ],
        currentPage: 0,
        prevPage: 0,
}

const pageSlice = createSlice({
    name: 'page',
    initialState,
    reducers: {
    updatePage(state : pagesliceval, action) {
        state.prevPage = state.currentPage;
        let index = state.currentPage;
        for(let i=0;i<state.locations.length;i++){
        if(state.locations[i].location === action.payload){
            index = i;
            break;
        }
        }
        state.currentPage = index;
    }
    }
})

export const { updatePage } = pageSlice.actions
export default pageSlice
