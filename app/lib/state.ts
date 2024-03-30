import { create } from 'zustand'

const useSettingStore = create((set) => ({
  startRating: 0,
  endRating: 4000,
  filterTags: [],
  settingId: 1,
  setStartRating: (rating: number) => set({ startRating: rating }), 
  setEndRating: (rating: number) => set({ endRating: rating }), 
}))

export { useSettingStore };