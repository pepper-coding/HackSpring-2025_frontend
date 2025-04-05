import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/notapp/providers/store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
