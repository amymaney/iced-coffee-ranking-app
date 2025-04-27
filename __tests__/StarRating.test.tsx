import { render, screen, fireEvent } from "@testing-library/react";
import StarRating from "@/app/components/StarRating";

describe('StarRating Component', () => {
    const mockOnRatingChange = jest.fn();

    test('renders correct number of filled stars based on value', ()=>{
        const { getAllByRole } = render(
            <StarRating name="rating" value={3} />
        );

        const starButtons = getAllByRole('button');
        starButtons.slice(0, 3).forEach((button) => {
            const star = button.querySelector('svg'); 
            expect(star).toHaveClass('text-[#EFBB2C] fill-[#EFBB2C]');
        });

        starButtons.slice(3).forEach((button) => {
            const star = button.querySelector('svg');
            expect(star).not.toHaveClass('text-[#EFBB2C] fill-[#EFBB2C]'); 
        });
    });

    test('calls onRatingChange when a star is clicked', ()=>{
        render(<StarRating name="coffee-rating" value={3} onRatingChange={mockOnRatingChange} />);

        // 4th star is clicked
        const starButtons = screen.getAllByRole('button');
        fireEvent.click(starButtons[3]);

        // onRatingChange callback called with 4
        expect(mockOnRatingChange).toHaveBeenCalledWith(4);
    });

    test('does not call onRatingChange if not given', ()=>{
        const mockOnRatingChange = jest.fn();
        render(<StarRating name="coffee-rating" value={3} />);
        const starButtons = screen.getAllByRole('button');
        fireEvent.click(starButtons[0]);

        expect(mockOnRatingChange).not.toHaveBeenCalled();
    });

    test('has accessible role and aria-label for each star', ()=>{
        render(<StarRating name="coffee-rating" value={3} onRatingChange={mockOnRatingChange} />);
        const starButtons = screen.getAllByRole('button');

        starButtons.forEach((button, index)=>{
            expect(button).toHaveAttribute('aria-label', `Rate ${index + 1} stars`);
        })
    });
});