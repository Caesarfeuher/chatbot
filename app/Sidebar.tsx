import { useEffect, useState } from 'react';
import ViewSidebarIcon from "@mui/icons-material/ViewSidebar";
import RateReviewIcon from "@mui/icons-material/RateReview";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  clearMessages: () => void;
}

interface Message {
  question: string;
  answer?: string;
}

const Sidebar = ({ isOpen, toggleSidebar, clearMessages }: SidebarProps) => {
  const [history, setHistory] = useState<Message[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/history');
        const data: Message[] = await response.json();
        setHistory(data);
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className={`flex flex-col ${isOpen ? "w-64" : "w-0"} bg-black min-h-screen transition-all duration-300 overflow-hidden`}>
      <div className="flex justify-between items-center p-2">
        <ViewSidebarIcon onClick={toggleSidebar} className="text-white cursor-pointer" fontSize="large" />
        {isOpen && <RateReviewIcon className="text-white cursor-pointer" fontSize="large" onClick={clearMessages} />}
      </div>
      {isOpen && (
        <>
          <h2 className="text-white text-xl mb-4 px-4">History</h2>
          <div className="px-4">
            {history.length ? (
              history.map((item, index) => (
                <div key={index} className="mb-2">
                  <p className="text-gray-400 text-sm">Q: {item.question}</p>
                  <p className="text-gray-200 text-sm">A: {item.answer}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No history available</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;

