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

  const handleSubmit =  async (e:Event) => {
    e.preventDefault();
    SetLoading(true);
    if(isValidData(formData))
    {
        switch(formData.platform)
        {
            case "GeekForGeeks":
                switch(formData.action)
                {
                    case "profileCard":
                        let response = await get(apiUrls.GFG, { action: formData.action, theme: formData.theme, userName: formData.userName });
                        const blob = new Blob([response], {type: 'image/svg+xml'});
                        const url = URL.createObjectURL(blob);
                        setRawData("");
                        setImage(url);
                        break;
                    case "rawData":
                        let responseRawData = await get(apiUrls.GFG, { action: formData.action, theme: formData.theme, userName: formData.userName });
                        setImage("");
                        setRawData(JSON.stringify(responseRawData, null, 4));
                        break;
                    case "Markdown":
                        break;
                }
                break;
            case "LeetCode":
                switch(formData.action)
                {
                    case "profileCard":
                        let response = await get(apiUrls.LeetCode, { action: formData.action, theme: formData.theme, userName: formData.userName });
                        const blob = new Blob([response], {type: 'image/svg+xml'});
                        const url = URL.createObjectURL(blob);
                        setRawData("");
                        setImage(url);
                        break;
                    case "rawData":
                        let responseRawData = await get(apiUrls.LeetCode, { action: formData.action, theme: formData.theme, userName: formData.userName });
                        setImage("");
                        setRawData(JSON.stringify(responseRawData, null, 4));  
                        break;
                    case "Markdown":
                        break;
                }
                break;  
        }
    }
    SetLoading(false);       
  }


  const isValidData = (formData:IFormData) => {
    console.log(formData);
    return true;
  }

  async function copyImg() {
    const permission = await navigator.permissions.query({ name: "clipboard-write" as PermissionName });

    if (permission.state === "denied") {
        alert("Clipboard access is denied. Please allow clipboard permissions.");
        return;
    }

    console.log(document.hasFocus());
    const img = await fetch(image);
    const imgBlob = await img.blob();
    navigator.clipboard.write([
        new ClipboardItem({'image/svg+xml':imgBlob})
    ]);
  }

  
  return (
    <>
        <div className='w-50 d-flex justify-content-center align-items-center '>
            <form style={{width:"65%"}} className='border d-flex flex-column gap-3 shadow rounded-3 pb-3'>

                <div className='border-bottom py-2'>
                    <p className='fw-bold px-3' style={{fontSize:"20px"}}>Card Generator</p>
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
                                <span title="download" className='click-action'>
                                    <MdOutlineFileDownload className='fs-4 cursor-pointer text-blue'/>
                                </span>
                                <span title='Copy' className='click-action' onClick={copyImg}>
                                    <FaRegCopy className='fs-5 cursor-pointer text-blue' />
                                </span>
                            </div>
                        </div>
                    }
                    { rawData &&
                        <pre style={{height:"200px", overflow:"scroll", backgroundColor:"#f5f5ff"}} className="border">
                            {rawData}
                        </pre>
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