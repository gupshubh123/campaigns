import React, { Component } from 'react'
import { Trans, withNamespaces } from 'react-i18next'
import i18n from '../../i18n/i18n';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PriceViewIcon from '../../assets/tableImgs/price.png'
import FileIcon from '../../assets/tableImgs/file.png'
import ReportIcon from '../../assets/tableImgs/report.png'
import ScheduleIcon from '../../assets/tableImgs/calendar.png'
import './campaignmanagement.css'
import {FETCH_CAMPAIGN_LIST} from '../../constants'

export class CampaignManagement extends Component {
    state= {
        isSelectedTab:'upcoming',
        campaignData:[],
        activeClickedIndex:null,
        startDate: new Date(),
        isDataLoaded: false
    }
    eventCategory={
        upcoming:[],
        live:[],
        past:[]
    }

    //trigger the component's locale
    changeLanguage =(langCode)=>{
        i18n.changeLanguage(langCode);
    }

    // handle the click of user chainging the campaign-type navigation tab
    changeCampaignType=(campaignType)=>{
        this.setState({
            isSelectedTab:campaignType,
            activeClickedIndex:null,
        })
    }

    // calcualtes and returns the difference b/w two days, parameters provided in timestamps
    getDayDifference = timestamp => Math.round((Number(new Date().getTime())-Number(timestamp))/(1000*60*60*24))
   

    //seggregates the list of all events into upcoming, live and past category
    categorizeEventData = (campaignData)=>{
        this.eventCategory={
            upcoming:[],
            live:[],
            past:[]
        }
        campaignData.forEach((item)=>{
            if(this.getDayDifference(item.createdOn) <0){
                this.eventCategory['upcoming'].push(item);
            }else if(this.getDayDifference(item.createdOn) === 0){
                this.eventCategory['live'].push(item);
            }else{
                this.eventCategory['past'].push(item);
            }
        })
    }

    // helper function to return the date in expected format MM YYYY, DD
    getDateString=(timestamp)=>{
        let dateObj = new Date(timestamp);
        let month = dateObj.toLocaleString('default', { month: 'short' });
        let year = dateObj.getFullYear();
        let date = dateObj.getDate();
        return  `${month} ${year}, ${date}`;
    }

    // helper function to return the day difference in expected format x days ago, y days ahead
    getDayDifferenceString = (timestamp)=>{
        
        let dayDifference = this.getDayDifference(timestamp)
        if(dayDifference <0) 
            return `${dayDifference*-1} ${this.props.t('DAYS_AHEAD')}` 
        else if(dayDifference >0) 
            return `${dayDifference} ${this.props.t('DAYS_AGO')}`
        return ``    

    }

    // triggers modal and tracks which event item was clicked
    triggerPriceModalHandler=(activeIndex)=>{
        this.setState({
            activeClickedIndex:+activeIndex+1
        })
    }

    // reschedules the event item from main list and triggers re-render of the component, also, shows a snack bar for user feedback
    rescheduleEvent=(newDate, id)=>{
        let newData = [...this.state.campaignData]
        newData[id-1].createdOn = new Date(newDate)
        this.setState({
            campaignData:newData
        },()=>{
            let snackbar = document.getElementById("snackbar");
            snackbar.className = "show";
            setTimeout(function(){ snackbar.className = snackbar.className.replace("show", ""); }, 3000);
        })
    }

    // triggers open calender
    triggerOpenCalendar=(e,id)=>{
        let datePickerElem = e.target.nextSibling.querySelector(`input#dateChoose-${id}`)
        datePickerElem.click()
    }
    render() {
        let campaignData = [...this.state.campaignData]
        this.categorizeEventData(campaignData);
        let activeListToDisplay = [...this.eventCategory[this.state.isSelectedTab]]
        return (
            <>  
            {this.state.isDataLoaded?    
            <>
                <div id="snackbar">
                    <Trans>EVENT_SUCCESSFULLY_RESCHEDULED</Trans>
                </div>
                <div className="sectionHeading">
                    <Trans>MANAGE_CAMPAIGN</Trans>
                </div>
                
                <div className="dropdown changeLanguageContainer">
                    <button className="btn btn-secondary dropdown-toggle langBtn" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <Trans>CHANGE_LANGUAGE</Trans>
                    </button>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <span className="dropdown-item" id="langeng" onClick={()=>this.changeLanguage('en')}>English</span>
                            <span className="dropdown-item" id="langgr" onClick={()=>this.changeLanguage('gr')}>German</span>
                        </div>
                    </div>
                
                <div className="campaignTypeMenu flexContainer"> 
                    <div className={`campaignType upcoming ${this.state.isSelectedTab === 'upcoming'?'activeCampaignTab':''} `} onClick={()=>this.changeCampaignType('upcoming')}>
                        <Trans>UPCOMING_CAMPAIGN</Trans>
                    </div>
                    <div className={`campaignType live ${this.state.isSelectedTab === 'live'?'activeCampaignTab':''} `} onClick={()=>this.changeCampaignType('live')}>
                        <Trans>LIVE_CAMPAIGN</Trans>
                    </div>
                    <div className={`campaignType past ${this.state.isSelectedTab === 'past'?'activeCampaignTab':''} `} onClick={()=>this.changeCampaignType('past')}>
                        <Trans>PAST_CAMPAIGN</Trans>
                    </div>
                </div>
                
                {activeListToDisplay.length>0?
                    <div className="campaignTable">
                        <div className="campaignTableHeader flexContainer">
                            <div className="colItem colt1"><Trans>DATE</Trans></div>
                            <div className="colItem colt2"><Trans>CAMPAIGN</Trans></div>
                            <div className="colItem colt3"><Trans>VIEW</Trans></div>
                            <div className="colItem colt4"><Trans>ACTIONS</Trans></div>
                        </div>
                        
                        <div className="campaignTableRowsContainer">
                            {activeListToDisplay.map((item, index)=>{
                                return(
                                    <div className="campaignTableRow flexContainer" key={`tablerow-${index+1}`} id={`campaignRow-${this.state.isSelectedTab}-${index}`}>
                                        <div className="colItem colt1">
                                            <div className="dateItemContainer">
                                                <div className="dateString">
                                                    {this.getDateString(item.createdOn)}
                                                </div>
                                                <div className="dayDifference">
                                                    <i>{this.getDayDifferenceString(item.createdOn)}</i>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="colItem colt2">
                                        <div className="campaignNameContainer flexContainer">
                                                <div className="gameImg">
                                                    
                                                    <img src={`${window.location.href}/assets/gamesImgs/img-${index+1}.png`} alt="icon"/>
                                                </div>
                                                <div className="gameName">
                                                    <div className="name">
                                                        {item.name}
                                                    </div>
                                                    <div className="region">
                                                        <i>{item.region}</i>
                                                    </div>
                                                </div>
                                        </div> 
                                        </div>
                                        <div className="colItem colt3 flexContainer">
                                            <div className="viewPriceContainer flexContainer">
                                                <div className="viewIcon rowIcon">
                                                    <img src={PriceViewIcon} alt="viewicon" />
                                                </div>
                                                <div className="label" onClick={()=>this.triggerPriceModalHandler(index)} data-toggle="modal" data-target="#exampleModal">
                                                    <Trans>VIEW_PRICING</Trans>
                                                </div>
                                            </div> 
                                        </div>
                                        <div className="colItem colt4 flexContainer">
                                            <div className="actionContainer flexContainer">
                                                <div className="actionItem rowIcon">
                                                    <img src={FileIcon} alt="fileicon" />
                                                    <span><Trans>CSV</Trans></span>
                                                </div>
                                                <div className="actionItem rowIcon">
                                                    <img src={ReportIcon} alt="reporticon" />
                                                    <span><Trans>REPORT</Trans></span>
                                                </div>
                                                <div className="actionItem rowIcon">
                                                    <img src={ScheduleIcon} alt="calendericon"/>
                                                    <span onClick={(e)=>this.triggerOpenCalendar(e,item.id)} style={{cursor:'pointer'}}><Trans>SCHEDULE_AGAIN</Trans></span>
                                                    <DatePicker selected={this.state.startDate} className="datepickerbox" id={`dateChoose-${item.id}`} onChange={(date)=>this.rescheduleEvent(date,item.id)}/>
                                                </div>
                                            </div> 
                                        </div> 
                                    </div>    
                                )
                            })}
                        </div>
                    </div>
                :
                <div className="noEventFound">
                    <Trans>NO_EVENT_FOUND</Trans>
                </div>
                }
                {this.state.activeClickedIndex?
                    <div className="modal fade custom-modal" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content gameDetailsPopup">
                        
                                <div className="modal-body">
                                    <div className="modalBodyHead flexContainer">
                                        <div className="gameImgContainer">
                                            <img src={`${window.location.href}/assets/gamesImgs/img-${Number(this.state.activeClickedIndex)}.png`} alt="icon"/>
                                        </div>
                                        <div className="gameNameContainer">
                                            <div className="popupGameName">{activeListToDisplay[this.state.activeClickedIndex-1].name}</div>
                                            <div className="popupRegionName">{activeListToDisplay[this.state.activeClickedIndex-1].region}</div>
                                        </div>
                                        
                                    </div>
                                    <div className="modalPricingLabel">
                                        <Trans>PRICING</Trans>
                                    </div>
                                    <div className="modalPricingValues flexContainer">
                                        <div className="duration">1 Week - 1 Month</div>
                                        <div className="actualPrice">{ `$ ${activeListToDisplay[this.state.activeClickedIndex-1].price}`}</div>
                                    </div>
                                    <div className="modalPricingValues flexContainer">
                                        <div className="duration">6 Months</div>
                                        <div className="actualPrice">{`$ ${Number(activeListToDisplay[this.state.activeClickedIndex-1].price)*6 -100}`}</div>
                                    </div>
                                    <div className="modalPricingValues flexContainer">
                                        <div className="duration">1 Year</div>
                                        <div className="actualPrice">{`$ ${Number(activeListToDisplay[this.state.activeClickedIndex-1].price)*12 -200}`}</div>
                                    </div>
                                </div>
                                <div className="modal-footer-custom">
                                    <div className="closePopup" data-dismiss="modal"><Trans>CLOSE</Trans></div>
                                </div>
                            </div>
                        </div>
                    </div>
                :null}
                {this.state.activeClickedIndex>=1 && activeListToDisplay.length>0?
                    <div className="modal fade" id="scheduleDate" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content gameDetailsPopup">
                        
                                <div className="modal-body">
                                    <div className="modalBodyHead flexContainer">
                                        <div className="gameImgContainer">
                                            <img src={`${window.location.href}/assets/gamesImgs/img-${Number(this.state.activeClickedIndex)}.png`} alt="icon"/>
                                        </div>
                                        <div className="gameNameContainer">
                                            <div className="popupGameName">{activeListToDisplay[this.state.activeClickedIndex-1].name}</div>
                                            <div className="popupRegionName">{activeListToDisplay[this.state.activeClickedIndex-1].region}</div>
                                        </div>
                                        
                                    </div>
                                    <div className="modalPricingLabel">
                                        <Trans>PRICING</Trans>
                                    </div>
                                    <div className="modalPricingValues flexContainer">
                                        <div className="duration">1 Week - 1 Month</div>
                                        <div className="actualPrice">{activeListToDisplay[this.state.activeClickedIndex-1].price}</div>
                                    </div>
                                    <div className="modalPricingValues flexContainer">
                                        <div className="duration">6 Months</div>
                                        <div className="actualPrice">{Number(activeListToDisplay[this.state.activeClickedIndex-1].price)*6 -100}</div>
                                    </div>
                                    <div className="modalPricingValues flexContainer">
                                        <div className="duration">1 Year</div>
                                        <div className="actualPrice">{Number(activeListToDisplay[this.state.activeClickedIndex-1].price)*12 -200}</div>
                                    </div>
                                </div>
                                <div className="modal-footer-custom">
                                    <div className="closePopup" data-dismiss="modal"><Trans>CLOSE</Trans></div>
                                </div>
                            </div>
                        </div>
                    </div>
                :null}
            </>  
            :
            <div className="loader">
                <img src={`${window.location.href}/assets/loader.gif`} alt="icon"/>
            </div>}     
            </>
            
        )
    }
    componentDidMount = async() => {
        //let response = await fetch(FETCH_CAMPAIGN_LIST);
        //let campaignData = await response.json()
        /**
         * api end point is not working anymore due to CORS error
         */
        let campaignData={...JSON.parse(JSON.stringify({"data":[{"name":"Summoners War","id":"1","region":"US","createdOn":1622745000000,"price":"100","csv":"Some CSV link for Whatsapp","report":"Some report link for Whatsapp","image_url":"img-1"},{"name":"Garena Free Fire","id":"2","region":"CA, FR","createdOn":1588530600000,"price":"150","csv":"Some CSV link for Super Jewels Quest","report":"Some report link for Super Jewels Ques","image_url":"img-2"},{"name":"Mortal Kombat","id":"3","region":"FR","createdOn":1585938600000,"price":"125","csv":"Some CSV link for Mole Slayer","report":"Some report link for Mole Slayer","image_url":"img-3"},{"name":"Auto Chess","id":"4","region":"JP","createdOn":1584642600000,"price":"145","csv":"Some CSV link for Mancala Mix","report":"Some report link for Mancala Mix","image_url":"img-4"},{"name":"Need For Speed","id":"5","region":"IN","createdOn":1616178600000,"price":"250","csv":"Some CSV link for Mancala Mix","report":"Some report link for Mancala Mix","image_url":"img-5"},{"name":"Shadow Fighter 3","id":"6","region":"UK","createdOn":1617215400000,"price":"400","csv":"Some CSV link for Mancala Mix","report":"Some report link for Mancala Mix","image_url":"img-6"},{"name":"Mancala Mix","id":"7","region":"PN","createdOn":1612463400000,"price":"30","csv":"Some CSV link for Mancala Mix","report":"Some report link for Mancala Mix","image_url":"img-7"},{"name":"Mancala Mix","id":"8","region":"US","createdOn":1617733800000,"price":"130","csv":"Some CSV link for Mancala Mix","report":"Some report link for Mancala Mix","image_url":"img-8"},{"name":"Mancala Mix","id":"9","region":"IN","createdOn":1617993000000,"price":"80","csv":"Some CSV link for Mancala Mix","report":"Some report link for Mancala Mix","image_url":"img-8"},{"name":"Mancala Mix","id":"10","region":"IR","createdOn":1618425000000,"price":"60","csv":"Some CSV link for Mancala Mix","report":"Some report link for Mancala Mix","image_url":"img-10"},{"name":"Mancala Mix","id":"11","region":"GB","createdOn":1614364200000,"price":"95","csv":"Some CSV link for Mancala Mix","report":"Some report link for Mancala Mix","image_url":"img-11"},{"name":"Mancala Mix","id":"12","region":"JP","createdOn":1619029800000,"price":"130","csv":"Some CSV link for Mancala Mix","report":"Some report link for Mancala Mix","image_url":"img-12"}]}))}
        this.setState({
            campaignData:campaignData.data,
            isDataLoaded:true
        })
    }   
}

export default withNamespaces()(CampaignManagement)

