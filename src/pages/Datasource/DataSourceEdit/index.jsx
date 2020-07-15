/**
  * @description: 数据中台-数据源-数据源管理-新建/修改数据源
  * @author: hj
  * @update: hj(2020-01-14)
  */
import React from 'react';
import $http from '@/service/Services';
import DataSourceAdd from '../DataSourceAdd';


const axios = $http;



/**
 * list
 */
class DataSourceEdit extends React.Component {
  constructor(props) {
    super(props);
  }


  /**
     * 表
     * @returns {*}
     */
  render() {
    return (
      <DataSourceAdd />
    );
  }

}

export default DataSourceEdit;
