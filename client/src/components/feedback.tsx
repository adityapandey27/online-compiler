import React, { useState } from "react";

import { ToastContainer, toast } from 'react-toastify';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState<number>(0);
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);


  const handleSubmit = async () => {
    if (!rating || !text.trim()) {
    //   alert("Please fill in both rating and feedback.");
    toast("Please fill in both rating and feedback.")
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating,text }),
      });

      if (res.ok) {
        
        toast("Feedback submitted successfully!")
        onClose();
        setRating(0);
        setText("");
      } else {
        toast("Failed to submit feedback. try again!")
      }
    } catch (err) {
      toast("Failed to submit feedback. try again!")
    } finally {
      setLoading(false);
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg" style={{ minWidth: "25%" }}>
        <h2 className="text-xl font-semibold mb-4">Give Feedback</h2>

        {/* Star Rating */}
        <div className="mb-4">
          <label className="block  font-medium">Rate your experience:</label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2l ${
                  star <= rating ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Text Feedback */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Feedback:</label>
          <textarea
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="border rounded w-full p-2 resize-none"
            placeholder="Write your feedback here..."
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
