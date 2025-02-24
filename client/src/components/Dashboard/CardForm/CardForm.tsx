import { useState } from "react";
import { FaRegCopy } from "react-icons/fa6"
import { MdOutlineFileDownload } from "react-icons/md"
import { IFormData } from "../../../interfaces/IFormData";
import { get } from "../../../services/HttpsService";
import { apiUrls } from "../../../constants/Constants";

function CardForm() {  

  const  [formData, SetFormData] = useState({
    theme:'dark',
    platform:'',
    userName:'',
    action:'profileCard'
  });

  const [isLoading, SetLoading] = useState(false);
  const [image, setImage] = useState("");
  const [rawData,setRawData] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [markdownText, setMarkdownText] = useState("");

  const handleInputChange = (key: keyof IFormData, e:Event) => {    
    let value ;
    if( key === 'action' )
    {
        value = (e.target as HTMLDivElement).id;
    }
    else{
        value = (e.target as HTMLInputElement).value;
    }
    SetFormData({...formData, [key]:value});
  }
  
  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    SetLoading(true);
    setErrorMessage(""); // Reset error state

    if (!formData.platform || !formData.userName) {
        setErrorMessage("Platform and username are required.");
        SetLoading(false);
        return;
    }

    try {
        let response;
        switch (formData.platform) {
            case "GeekForGeeks":
                response = await get(apiUrls.GFG, {
                    action: formData.action,
                    theme: formData.theme,
                    userName: formData.userName,
                });
                break;
            case "LeetCode":
                response = await get(apiUrls.LeetCode, {
                    action: formData.action,
                    theme: formData.theme,
                    userName: formData.userName,
                });
                break;
            default:
                setErrorMessage("Invalid platform selected.");
                SetLoading(false);
                return;
        }

        if (formData.action === "profileCard") {
            const blob = new Blob([response], { type: "image/svg+xml" });
            setImage(URL.createObjectURL(blob));
            setRawData("");
            setMarkdownText("");
        } else if (formData.action === "rawData") {
            setRawData(JSON.stringify(response, null, 4));
            setImage("");
            setMarkdownText("");
        } else if( formData.action == "Markdown" ) {
            let apicall = "";
            if( formData.platform == "GeekForGeeks" )
            {
                apicall = 'gfg-stats';
            }
            else if( formData.platform == "LeetCode" )
            {
                apicall = 'leetcode-stats';
            }
            setMarkdownText(`[![stats](https://coding-cards.vercel.app/api/${apicall}?action=${formData.action}&theme=${formData.theme}&userName=${formData.userName})]`)
            setRawData("");
            setImage("");
        }


    } catch (error) {
        console.error("API Error:", error);
        setErrorMessage("Failed to fetch data. Please try again.");
    } finally {
        SetLoading(false);
    }
  };
  
  async function copyImg(data: any, format: string) {
    console.log(data, format);
    let mimeType = 'text/plain';

    if (format === "rawData") {
        mimeType = 'text/plain';
    } else if (format === "Markdown") {
        mimeType = 'text/plain';
    }

    await navigator.clipboard.write([
        new ClipboardItem({
            [mimeType]: new Blob([data], { type: mimeType })
        })
    ]);
  }

  const downloadSvg = () => {
    const a = document.createElement("a");
    a.href = image;
    a.download = "image.svg";
    a.click();
  }


  
  return (
    <>
        <div className='w-50 d-flex justify-content-center align-items-center '>
            <form style={{width:"65%"}} className='border d-flex flex-column gap-3 shadow rounded-3 pb-3'>

                <div className='border-bottom py-2 d-flex gap-1 align-items-center'>
                    <p className='fw-bold ps-3' style={{fontSize:"20px"}}>Card Generator</p>
                    {errorMessage && <p className="text-danger mt-1 extra-small-text fw-bold">{errorMessage}</p>}
                </div>

                <div className='px-3 d-flex flex-column gap-3'>
                    <div className='d-flex flex-column'>
                        <label>Platform <span className="fw-bold text-danger">*</span></label>
                        <select name="platform" id="platform" className='outline-0 cursor-pointer p-1 border-0 bg-transparent border-bottom rounded-2' onChange={(e:any) => handleInputChange('platform',e)}>
                            <option value="" hidden defaultChecked>Select Platform</option>
                            <option value="GeekForGeeks">Geek For Geeks</option>
                            <option value="LeetCode">LeetCode</option>
                            {/* <option value="CodeChef">CodeChef</option> */}
                            {/* <option value="CodeForces">CodeForces</option> */}
                        </select>
                    </div>

                    <div className='d-flex flex-column'>
                        <label htmlFor="userName">username <span className="fw-bold text-danger">*</span></label>
                        <input type="text" name="userName" id="userName" className='outline-0 p-1 border-0 bg-transparent border-bottom rounded-2' placeholder='Enter your username' onChange={(e:any) => handleInputChange("userName",e)}/>
                    </div>


                    <div className='d-flex flex-column'>
                        <label htmlFor="theme">Theme</label>
                        <select name="theme" id="theme" className='outline-0 border-0 bg-transparent border-bottom rounded-2 cursor-pointer' onChange={(e:any) => handleInputChange('theme',e)}>
                            <option value="dark">Dark</option>
                            <option value="light">Light</option>
                        </select>
                    </div>

                   <div className="d-flex border rounded-2 w-100">
                        <div style={{width:"34%"}} className={`px-3 py-1 rounded-2 cursor-pointer text-center fw-bold ${formData.action == "profileCard" ? 'bg-blue text-white' : 'bg-white text-black'}`} onClick={(e:any) => {handleInputChange("action",e)}} id="profileCard">Profile Card</div>
                        <div style={{width:"33%"}} className={`px-3 py-1 rounded-2 cursor-pointer text-center fw-bold ${formData.action == "rawData" ? 'bg-blue text-white' : 'bg-white text-black'}`} onClick={(e:any) => {handleInputChange("action",e)}} id="rawData">Raw Data</div>
                        <div style={{width:"33%"}} className={`px-3 py-1 rounded-2 cursor-pointer text-center fw-bold ${formData.action == "Markdown" ? 'bg-blue text-white' : 'bg-white text-black'}`} onClick={(e:any) => {handleInputChange("action",e)}} id="Markdown">Markdown</div>
                    </div>

                    {image &&
                        <div className='w-100 d-flex gap-2 align-items-end '>
                            <img src={image} style={{width:"370px"}}/>
                            <div className='d-flex flex-column gap-3 justify-content-end pb-2'>
                                <span title="download" className='click-action' onClick={downloadSvg}>
                                    <MdOutlineFileDownload className='fs-4 cursor-pointer text-blue'/>
                                </span>
                            </div>
                        </div>
                    }
                    { rawData &&
                        <div className="d-flex gap-2 w-100">
                            <pre style={{height:"200px", overflow:"scroll", backgroundColor:"#f5f5ff", width:"90%"}} className="border ">
                                {rawData}
                            </pre>
                            <div className='d-flex flex-column gap-3 justify-content-end pb-2'>
                                <span title='Copy' className='click-action' onClick={() => copyImg(rawData, "rawData")}>
                                    <FaRegCopy className='fs-5 cursor-pointer text-blue' />
                                </span>
                            </div>
                        </div>
                    }
                    { markdownText &&
                        <div className="d-flex gap-2">
                            <pre style={{height:"50px", overflow:"scroll", backgroundColor:"#f5f5ff", width:"90%"}} className="border ">
                                {markdownText}
                            </pre>
                             <div className='d-flex flex-column gap-3 justify-content-end pb-2'>
                                <span title='Copy' className='click-action' onClick={() => copyImg(markdownText, "Markdown")}>
                                    <FaRegCopy className='fs-5 cursor-pointer text-blue' />
                                </span>
                            </div>
                        </div>
                    }
                    <button 
                        className="bg-blue text-white fw-bold rounded-2 border-0 outline-0 py-2 cursor-pointer"
                        onClick={(e:any) => handleSubmit(e)}
                    >
                        Get Results
                    </button>
                </div>
            </form>
        </div>
        {isLoading &&
            <div className="position-absolute top-0 start-0 vh-100 vw-100 d-flex justify-content-center align-items-center" style={{background:"rgba(0,0,0,0.4)"}}>
                <p className="text-white">Loading...</p>
            </div>
        }
    </>
  ) 
}

export default CardForm