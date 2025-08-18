import React from 'react'
import './ExploreMenu.css'
import { menu_list } from '../../assets/assets'



// destructuring props to get category and setCategory
const ExploreMenu = ({category,setCategory}) => {
  return (
    <div className='explore-menu' id='explore-menu'>
        <h1>Explore Our Menu</h1>
        <p  className='explore-menu-text'>Choose from a divese menu etc</p>
        <div className='explore-menu-list'>
            {/* rendering the menu_list using the map function  */}
            {menu_list.map((item, index) => {
                return ( 
                    // onClick event to set the category state and assign the active class to the clicked item
                    <div onClick={()=> setCategory(prev=> prev===item.menu_name ? "All" : item.menu_name)} key={index} className="explore-menu-list-item">
                        {/* item is obj where menu_name and menu_image are its properties */}
                        <img className={category===item.menu_name?"active":""} src={item.menu_image} alt={item.menu_name} />
                        <p>{item.menu_name}</p>
                    </div>
                )
            })}
        </div>
        <hr />
    </div>
  )
}

export default ExploreMenu
