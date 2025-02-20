// // import { useEffect, useState } from "react";
// // import { useNavigate, useSearchParams } from "react-router-dom"
// // import { apiUrls, LeetCodeBody, Platforms } from "../../constants/Constants";
// // import { get } from "../../services/HttpsService";
// // import { generateCounterCards } from "../../services/CardService";

// // function Card() 
// // {
// //   const navigate = useNavigate();
// //   const [platform,SetPlatform] = useState('');
// //   const [userName,SetUserName] = useState('');
// //   const [searchParams] = useSearchParams();

// //   const updateState = async () => {
// //     const platform = searchParams.get('platform')||'';
// //     const userName = searchParams.get('userName')||'';
// //     SetPlatform(platform);
// //     SetUserName(userName);
// //   }

// //   const cardManager = async () => {
// //     if( platform && userName )
// //     {
// //       let data;
// //       switch(platform)
// //       {
// //         case Platforms.GeekForGeeks:
// //           data = await get(apiUrls.GeekForGeeks+userName+'.json');
// //           return await generateCounterCards(data);
// //         case Platforms.LeetCode:
// //           data = await get(apiUrls.LeetCode,LeetCodeBody);
// //           return await generateCounterCards(data);
// //       }
// //     }
// //     else
// //     {
// //       navigate('/error');
// //     }
// //   }

// //   useEffect(() => {
// //     await updateState();
// //     let card = await cardManager();
// //   },[platform,userName])

// //   return (
// //     <div>
      
// //     </div>
// //   )
// // }

// // export default Card
// import { useEffect, useState, useRef} from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import html2canvas from "html2canvas";
// import { apiUrls, LeetCodeBody, Platforms } from "../../constants/Constants";
// // import { get } from "../../services/HttpsService";
// // import { generateCounterCards } from "../../services/CardService";

// const Card = () => {
//   const navigate = useNavigate();
//   const [platform, setPlatform] = useState<string>('');
//   const [userName, setUserName] = useState<string>('');
//   const [image, setImage] = useState<string | null>(null);
//   const cardRef = useRef<HTMLDivElement>(null);
//   const [searchParams] = useSearchParams();

//   useEffect(() => {
//     debugger;
//     const updateState = async () => {
//       const platform = searchParams.get('platform') || '';
//       const userName = searchParams.get('userName') || '';
//       setPlatform(platform);
//       setUserName(userName);
//     };
//     updateState();
//   }, [searchParams]);

//   useEffect(() => {
//     const fetchAndGenerateCard = async () => {
//       if (!platform || !userName)  return;
      
//       try {
//         let data;
//         switch (platform) {
//           case Platforms.GeekForGeeks:
//             // data = await get(`${apiUrls.GeekForGeeks}${userName}.json`);
//             break;
//           case Platforms.LeetCode:
//             // data = await get(apiUrls.LeetCode, LeetCodeBody);
//             break;
//           default:
//             navigate('/error');
//             return;
//         }

//         renderCardAsImage(data);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         navigate('/error');
//       }
//     };

//     const renderCardAsImage = async (data: any) => {
//       if (!cardRef.current) return;

//       cardRef.current.innerHTML = '';
//       const cardContent = generateCounterCards(data);
//       cardRef.current.appendChild(cardContent as unknown as Node);

//       // await new Promise(resolve => setTimeout(resolve, 100));

//       html2canvas(cardRef.current).then(canvas => {
//         const imgData = canvas.toDataURL('image/png');
//         setImage(imgData);
//       }).catch(error => {
//         console.error('Error generating image:', error);
//       });
//     };

//     fetchAndGenerateCard();
//   }, [platform, userName]);

//   return (
//     <div className="text-center p-4">
//       {image ? (
//         <div className="mt-4">
//           <h4>Generated Card Image:</h4>
//           <img src={image} alt="Generated Card" className="img-thumbnail" />
//         </div>
//       ) : (
//         <p>Loading...</p>
//       )}
//       <div ref={cardRef} style={{ display: 'none' }}></div>
//     </div>
//   );
// };

// export default Card;
