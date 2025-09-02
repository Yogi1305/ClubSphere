import { User } from "../model/User.js";
import { Voting } from "../model/Voting.js";

// create poll
export const createpoll = async (req, res) => {
  try {
    const { Title, Optionsize,Organization, Participate, Totalvoter, Starttime, Endtime } =
    req.body;

  if (
    !Endtime ||
    !Starttime ||
    !Totalvoter ||
    !Participate ||
    !Optionsize ||
    !Title||!Organization
  )
    return res.status(200).json({ success:false,message: "All field are Required" });
    const finduser= await User.findById({ _id: req.body.userId });
    if(!finduser)   return res.status(404).json({success:false,message:"User not found"});
    finduser.poll = finduser.poll - 1;
    if(finduser.poll<0){
      finduser.poll = 0;
      finduser.role = "USER"; 
      return res.status(200).json({success:false,message:"You have no poll left to create, please contact admin to increase your poll limit."});

    } 
    await finduser.save();
  const newpoll = await Voting.create({
    Title,
    Organization,
    Optionsize,
    Participate,
    Totalvoter: [],
    Starttime,
    Endtime,
  });
  await newpoll.save;
  return res.status(200).json({success:true,message:`${Title} poll is created successfully!`})
  } catch (error) {
    console.log("poll creation ",error);
    return res.status(500).json({message:"internal server error"})
  }
};
// get poll
export const getpoll=async(req,res)=>{
    try {
        // const {id:pollId}=req.params;
        
        const recentPolls = await Voting.find().sort({ createdAt: -1 });

        if(!recentPolls)
            return res.status(200).json({success:false,message:"No poll exist"});
        return res.status(200).json({success:true,message:"polling data",recentPolls});

    } catch (error) {
        console.log("error in getting all poll",error)
        return res.status(500).json({sucess:false,message:"internal server error"})
    }
}

// vote 
export const votetopoll = async (req, res) => {
  try {
    const { pollId, userId, index } = req.body;

    if (!pollId || !userId || index === undefined)
      return res.status(400).json({ success: false, message: "pollId, userId, and index are required" });

    const poll = await Voting.findById(pollId);
    if (!poll)
      return res.status(404).json({ success: false, message: "Poll not found" });

    // Check if poll is still active
    const now = new Date();
    if (now < poll.Starttime || now > poll.Endtime) {
      return res.status(403).json({ success: false, message: "Voting is closed" });
    }

    // Check if user already voted
    if (poll.Totalvoter.includes(userId)) {
      return res.status(403).json({ success: false, message: "User has already voted" });
    }

    // Validate index
    if (index < 0 || index >= poll.Participate.length) {
      return res.status(400).json({ success: false, message: "Invalid option index" });
    }

    // Register the vote
    poll.Participate[index].count.push(userId);
    poll.Totalvoter.push(userId);
    await poll.save();

    return res.status(200).json({ success: true, message: "Vote submitted successfully", poll });

  } catch (error) {
    console.error("Error submitting vote:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

