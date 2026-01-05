import { writable } from "svelte/store";

export const error = writable<string>("")
export const debugs = writable<string[]>([])
export const competing = writable<boolean>(false)