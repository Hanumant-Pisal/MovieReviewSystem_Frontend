import { useState } from 'react';

const ReviewForm = ({ onSubmit }) => {
    const [rating, setRating] = useState(5);
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ rating, text });
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <label>
                Rating:
                <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="ml-2">
                    {[1, 2, 3, 4, 5].map(star => (
                        <option key={star} value={star}>{star}</option>
                    ))}
                </select>
            </label>
            <textarea
                className="w-full mt-2 p-2 border"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write your review"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-2">Submit</button>
        </form>
    );
};

export default ReviewForm;
