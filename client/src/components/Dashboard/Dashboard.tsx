import CardForm from './CardForm/CardForm';
import DashboardCss from './Dashboard.module.scss';

function Dashboard() {
  return (
    <div className={`bg-black ${DashboardCss.dashboard} bg-light-blue d-flex px-5`}>
        {/* left */}
        <div className='d-flex flex-column justify-content-center w-50'>
            <p className='fs-40 fw-medium text-capitalize'> <span className='text-blue'>CODING </span> CARDS</p>
            <div className='mt-2'>
                <p className='lh-lg fw-medium text-justify word-spacing-1' style={{fontSize:"20px"}}>Showcase Your Coding Journey with a beautifully crafted Coding <span className='text-blue'>Profile Card</span>! Effortlessly generate personalized cards displaying your achievements from platforms like <span className='text-blue'>LeetCode</span> and <span className='text-blue'>GeeksforGeeks</span>. Share your coding stats, track your progress, and compare rankings—all in one place. With multiple customization options, you can design a unique profile that reflects your skills. Whether you're a competitive programmer or an aspiring developer, let your <span className='text-blue'>profile speak for itself</span>. <span className='text-blue'>Start creating your card</span> now and stand out in the coding community!</p>
            </div>
            <div className='mt-2'>
                <button 
                    className='outline-0 border-0 click-action d-flex justify-content-center align-items-center gap-2 px-3 py-2 bg-blue text-white fw-bold rounded-2'
                >
                    GitHub 
                </button>
            </div>
        </div>
        {/* right */}
        <CardForm/>
    </div>
  )
}

export default Dashboard