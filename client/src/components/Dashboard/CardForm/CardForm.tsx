import { useState } from "react";
import { FaRegCopy } from "react-icons/fa6"
import { MdOutlineFileDownload } from "react-icons/md"
import { IFormData } from "../../../interfaces/IFormData";
import {  generateCardSvg, loadGFGData, loadLeetCodeData} from "../../../services/Utils";

function CardForm() {  

  const  [formData, SetFormData] = useState({
    theme:'dark',
    platform:'',
    userName:'',
    action:'ProfileCard'
  });

  const [image, setImage] = useState("");

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
    if(isValidData(formData))
    {
        switch(formData.platform)
        {
            case "GeekForGeeks":
                var gfgStats = await loadGFGData();
                switch(formData.action)
                {
                    case "ProfileCard":
                        var cardSvg = await generateCardSvg(gfgStats, formData.theme);
                        setImage(cardSvg);
                        break;
                    case "RawData":
                        console.log(gfgStats);
                        break;
                    case "Markdown":
                        break;
                }
                break;
            case "LeetCode":
                var leetCodeStats = await loadLeetCodeData();
                console.log(leetCodeStats);
                switch(formData.action)
                {
                    case "ProfileCard":
                        break;
                    case "RawData":
                        break;
                    case "Markdown":
                        break;
                }
                break;
            case "CodeChef":
                break;
            case "CodeForces":
                break;
            case "HackerRank":
                break;
        }

    }
  }


  const isValidData = (formData:IFormData) => {
    console.log(formData);
    return true;
  }
  
  return (
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
                            <option value="CodeChef">CodeChef</option>
                            <option value="CodeForces">CodeForces</option>
                            <option value="HackerRank">HackerRank</option>
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
                        <div style={{width:"34%"}} className="px-3 py-1 rounded-2 cursor-pointer bg-blue text-white fw-bold" onClick={(e:any) => {handleInputChange("action",e)}} id="ProfileCard">Profile Card</div>
                        <div style={{width:"33%"}} className="px-3 py-1 rounded-2 cursor-pointer bg-white " onClick={(e:any) => {handleInputChange("action",e)}} id="RawData">Raw Data</div>
                        <div style={{width:"33%"}} className="px-3 py-1 rounded-2 cursor-pointer bg-white " onClick={(e:any) => {handleInputChange("action",e)}} id="Markdown">Markdown</div>
                    </div>

                    {image &&
                        <div className='w-100 d-flex gap-2'>
                            {/* <img src={image} alt="Generated Card" className="border rounded-2 w-100" /> */}
                            {image}
                            <div className='d-flex flex-column gap-3 justify-content-end pb-2'>
                                <span title="download" className='click-action'>
                                    <MdOutlineFileDownload className='fs-4 cursor-pointer text-blue'/>
                                </span>
                                <span title='Copy' className='click-action'>
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
  
  ) 
}

export default CardForm