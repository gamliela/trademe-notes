import "./firebase";
import {signin} from "./firebase";

console.log('Trademe Notes Loaded!');

signin().catch(e => console.error(e));
