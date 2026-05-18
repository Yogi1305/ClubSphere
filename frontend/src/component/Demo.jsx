import { useNavigate } from "react-router-dom";
 

export default function Demo() {
  const navigate = useNavigate();

  return (
    <div className="demo-page h-screen flex flex-col items-center justify-center bg-black">
<button
  onClick={() => navigate(-1)}
  className="border border-white/40 px-4 py-2 m-1 rounded-lg text-white bg-black/30 hover:bg-white hover:text-black"
>        ✕ Close
      </button>

      <video className = "w-[95%] max-w-6xl shadow-2xl" width="800" controls autoPlay>
        <source src="/clubsphere_demo.mp4" type="video/mp4" />
      </video>
    </div>
  );
}