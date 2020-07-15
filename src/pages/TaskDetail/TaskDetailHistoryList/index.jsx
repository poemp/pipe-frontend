/**
 * @description: 数据中台-任务-任务管理
 * @author: hj
 * @update: hj(2020-01-14)
 */
import React from 'react';
import Container from '@icedesign/container';
import styles from './index.module.scss';
import url from '@/request'
import {Button, Dialog, Input, Message, Pagination, Table} from '@alifd/next';
import ZgDialog from '@/components/ZgDialog';
import $http from '@/service/Services';
import AuthButton from '../../../components/AuthComponent/AuthBotton';


/**
 * list
 */
class TaskDetailHistoryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subjectId: '',
      current: 0,
      mockData: [],
      selectedList: [],
      condition: '',
      config: {
        data: null,
        visible: false,
        title: '',
        content: ''
      }
    };
    this.pageNum = 1; // 当前页数
    this.pageSize = 10; // 分页每页显示数据条数
    this.totalNum = 0; // 数据总条数
    this.$http = $http;
    this.onPageChange = this.onPageChange.bind(this);
    this.getTaskDetailHistoryList = this.getTaskDetailHistoryList.bind(this);
  }

  /**
   * 在渲染前调用,在客户端也在服务端
   */
  componentWillMount = () => {
    const params = new URLSearchParams(this.props.location.search);
    const taskDetailId = params.get('taskDetailId');
    this.setState({
      taskDetailId: taskDetailId
    }, () => {
      this.getTaskDetailHistoryList();
    });
  };


  /**
   * 条件
   * @param e
   * @param value
   */
  searchCondition = (value, e) => {
    this.setState({
      condition: value,
      config: {
        data: null,
        visible: false,
        title: '',
        content: ''
      }
    });
    this.pageNum = 1;
  };
  /**
   * 改变页面
   * @param currentPage
   */
  onPageChange = (currentPage) => {
    this.state = {
      current: currentPage,
      mockData: this.props.mockData,
      config: {
        data: null,
        visible: false,
        title: '',
        content: ''
      }
    };
    this.getTaskDetailHistoryList();
  };
  /**
   * 修改分页数据
   * @param currentPage
   */
  onChangePage = (currentPage) => {
    this.setState({
      loading: true,
      config: {
        data: null,
        visible: false,
        title: '',
        content: ''
      }
    });
    setTimeout(() => {
      this.getTaskDetailHistoryList(currentPage);
      this.setState({
        loading: false,
        config: {
          data: null,
          visible: false,
          title: '',
          content: ''
        }
      });
    }, 0);
  };

  /**
   * 获取数据
   */
  getTaskDetailHistoryList = (pageNum) => {
    const _this = this;
    _this.pageNum = typeof (pageNum) == 'number' ? pageNum : _this.pageNum;
    const {taskDetailId} = this.state;
    let urls = url.url + '/v1/taskDetailHistory/getTaskDetailHistoryPage/' + _this.pageSize + '/' + _this.pageNum + '/' + taskDetailId;
    this.$http.get(urls, {
      params: {
        value: _this.state.condition
      }
    })
      .then(function (response) {
        const {data} = response;
        _this.totalNum = data.data.total;
        data.data.voList.forEach((o, i) => {
          o.number = i + 1;
        });
        _this.setState({
          mockData: data.data.voList,
          current: data.data.current,
          config: {
            data: null,
            visible: false,
            title: '',
            content: ''
          }
        });
      })
      .catch(function (error) {
        Message.error(error.message);
      })

  };


  render() {
    const {mockData} = this.state;
    return (
      <div>
        <div className='container-header'>
          <p>任务管理</p>
          <Button type="normal" size="small" className='next-btn-normal table-btn-return' style={{float: 'right'}}>
            <a onClick={() => {
              this.props.history.go(-1)
            }}> 返回</a>
          </Button>
        </div>
        <Container className='container-main'>

          <div className='container-table'>
            <Table dataSource={mockData} primaryKey="id" className={styles.table}
                   rowSelection={{
                     onChange: this.onChange,
                     getProps: (record, index) => {
                       return {
                         children: ''
                       };
                     },
                     columnProps: () => {
                       return {
                         lock: 'left',
                         width: 90,
                         align: 'center'
                       };
                     },
                     titleAddons: () => {
                       return;
                     },
                     titleProps: () => {
                       return {
                         children: ''
                       };
                     }
                   }}>
              <Table.Column align="center" title="序号" width={50}  cell={
                (value, index, record) => {return index + 1 + (this.pageNum - 1) * this.pageSize;}
              }/>
              <Table.Column align="center" title="数据表" dataIndex="tableName"/>
              <Table.Column align="center" title="增量数据列" dataIndex="incrementColumn"/>
              <Table.Column align="center" title="增量数据" dataIndex="incrementValue"/>
              <Table.Column align="center" title="页大小" width={80}  dataIndex="pageSize"/>
              <Table.Column align="center" title="页码" width={80} dataIndex="pageNumber"/>
              <Table.Column align="center" title="进度" width={60} dataIndex="process"/>
              <Table.Column align="center" title="同步" width={80} dataIndex="complete" cell={
                (value, index, record) => {
                  if (record.complete === 1) {
                    return "增量同步"
                  }else{
                    return "全量同步"
                  }
                }
              }/>
              <Table.Column align="center" title="处理数据量" width={120} dataIndex="handleSum"/>
              <Table.Column align="center" title="开始时间" width={140} dataIndex={'startTime'}/>
              <Table.Column align="center" title="结束时间" width={140} dataIndex={'endTime'}/>
              <Table.Column align="center" title="同步" width={100} dataIndex="status" cell={
                (value, index, record) => {
                  if (record.status === 0) {
                    return '停止'
                  } else if (record.status === 1) {
                    return '启动'
                  } else if (record.status === 2) {
                    return '失败'
                  } else if (record.status === 3) {
                    return '成功'
                  }
                }
              }/>
            </Table>
            <ZgDialog config={this.state.config} cancelCall={this.cancelCall} okCall={this.okCall}/>
          </div>
          {/**
           * 分页
           * defaultCurrent 初始页码
           * total 总记录数
           * pageSize 一页中的记录数
           */}
          <Pagination defaultCurrent={1}
                      pageSize={this.pageSize}
                      total={this.totalNum}
                      onChange={this.onChangePage}
                      className="page-demo"
                      style={{textAlign: 'center'}}
          />
        </Container>
      </div>
    )
      ;
  }
}

export default TaskDetailHistoryList;
