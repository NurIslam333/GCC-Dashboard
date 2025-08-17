/* eslint-disable react-hooks/rules-of-hooks */
import update from 'immutability-helper'
import { useCallback, useState } from 'react'
import { Card } from '../components/drag-and-drop/Card'

const style = {
  width: 400,
}
 const index = () => {
  {
    const [cards, setCards] = useState([
      {
        id: 1,
        text: 'Write a cool JS library',
      },
      {
        id: 2,
        text: 'Make it generic enough',
      },
      {
        id: 3,
        text: 'Write README',
      },
      {
        id: 4,
        text: 'Create some examples',
      },
      {
        id: 5,
        text: 'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
      },
      {
        id: 6,
        text: '???',
      },
      {
        id: 7,
        text: 'PROFIT',
      },
    ])
    const moveCard = useCallback((dragIndex, hoverIndex) => {
      setCards((prevCards) => {
        const updatedCards = update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex]],
          ],
        });
  
        // Assuming you have an API function to update the card index
        updateCardIndex(prevCards[dragIndex].id, hoverIndex);
  
        return updatedCards;
      });
    }, []);
  
    const updateCardIndex = async (cardId, newIndex) => {
      try {
        console.log(cardId, newIndex);
        // Make your API call to update the card index
        // const response = await fetch(`/api/cards/${cardId}/update-index`, {
        //   method: 'PUT',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({ newIndex }),
        // });
  
        // if (!response.ok) {
        //   // Handle error as needed
        //   console.error('Failed to update card index');
        // }
      } catch (error) {
        // Handle error as needed
        console.error('Error updating card index:', error);
      }
    };
  
    const renderCard = useCallback((card, index) => {
      return (
        <Card
          key={card.id}
          item={card}
          index={index}
          id={card.id}
          text={card.text}
          moveCard={moveCard}
        />
      );
    }, [moveCard]);
  
    return (
      <>
        <div style={style}>{cards.map((card, i) => renderCard(card, i))}</div>
      </>
    )
  }
}

export default index;
