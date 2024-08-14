export type AfreecaTvApiResponse<T> =
  | {
      result: 1;
      data: T;
    }
  | {
      result: -1;
      data: {
        code: number;
        message: string;
      };
    };

// export type AfreecaTvApiResponseCaps<T> =
//   | {
//       RESULT: 1;
//       DATA: T;
//     }
//   | {
//       RESULT: -1;
//       DATA: {
//         CODE: number;
//         MESSAGE: string;
//       };
//     };
