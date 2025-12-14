  export type Theme = "light" | "dark";
  
  export type CartItem = {
    name: string;
    quantity: number;
    price: number;
    total: number;
  };

  export interface Message {
    start: number;
    end: number;
    text: string;
    class: string;
  }
