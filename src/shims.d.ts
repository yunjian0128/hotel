// global.d.ts
export {}

import React from 'react'

declare global {
  // interface Window {
  //   myFn?: Funciton,
  //   UI:any,
  //   Router: {
  //     useNavigate: Function
  //   }
  // }

  namespace React{
    let UI: Module;
    let HTTP: Module;
    let Router: Module;
    let Cookie: Module;
    let Business: any;
    let SetBusiness: Function;
    let navigate: Function;
    let back: Function;
    let success: Function;
    let error: Function;
  }
}