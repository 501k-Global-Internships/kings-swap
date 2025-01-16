import { devtools, persist } from "zustand/middleware";
import { create } from ".";


const initialState = {
  countries: null,
  selectedCountry: null,
}


export const useCountryStore = create()(
  devtools(persist((set) =>
  ({
    ...initialState,
    setCountries: (countries) => set({ countries }),
    setSelectedCountry: (selectedCountry) => set({ selectedCountry }),
    initialize: (countries, selectedCountry) => set({ countries, selectedCountry })
  }), { name: 'ks::countries' }))
)