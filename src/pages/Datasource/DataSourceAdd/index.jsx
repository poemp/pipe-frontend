import React from 'react';
import IceContainer from '@icedesign/container';
import {Button, Input, Message, Radio, Select, Switch} from '@alifd/next';
import {
  FormBinder as IceFormBinder,
  FormBinderWrapper as IceFormBinderWrapper,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import styles from './index.module.scss';
import url from '@/request'
import $http from '@/service/Services';


const axios = $http;

const {Option} = Select;
const {Group: RadioGroup} = Radio;
let form;

const Shape = {
  NO: 'normal',
  OFF: 'button'
};
const ItemDirection = {
  HORIZON: 'hoz',
  VERTICAL: 'ver'
};

/**
 * list
 */
class DataSourceAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      typeConfig: {},
      value: {},
      schemaList: [],
      addValue: {},
      mockData: [],
      types: [
        {
          id: "mysql",
          sourceType: "mysql"
        }, {
          id: "sqlserver",
          sourceType: "sqlserver"
        }
      ],
      change: false,
      arr: [{
        _id: Math.random().toString(36).substring(2),
        name: "",
        value: ""
      }],
      id: "",
      subjectId: "",
      addVisible: false,
      config: {
        data: null,
        visible: false,
        title: "",
        content: ""
      },
      placeholder: "请输入数据",
      shape: Shape.NO,
      itemDirection: ItemDirection.HORIZON
    };
    this.formChange = this.formChange.bind(this);
    this.validateAllFormField = this.validateAllFormField.bind(this);
    this.testConnect = this.testConnect.bind(this);
  }

  /**
   * 在渲染前调用,在客户端也在服务端
   */
  componentWillMount = () => {
    const params = new URLSearchParams(this.props.location.search);
    const id = params.get("dataSourceId");
    this.setState({
      id: id,
    }, () => {
      this.getSchemaList(1);
      if (id) {
        const that = this;
        axios.get(url.url + '/v1/tDataSource/getDataSourceVoById/' + id)
          .then(function (response) {
            const {data} = response;
            if (data.code === 1) {
              Message.warning(data.message ? data.message : data.data);
            } else {
              data.data.parametersVos.map(
                o => {
                  o["_id"] = Math.random().toString(36).substring(2);
                }
              );
              const ty = that.state.types.filter(
                o => {
                  return o.sourceType === data.data.dataSourceVo.sourceType;
                }
              );
              that.setState({
                typeConfig: ty[0] ? ty[0] : {},
                value: data.data.dataSourceVo,
                arr: data.data.parametersVos
              })
            }
          })
          .catch(function (error) {
            console.error(error);
            Message.error(error.message);
          })
      }
    });

  };


  /**
   * 高级属性是否可用
   * @param checked
   */
  onChange = (checked) => {
    this.setState({
      change: checked
    })
  }

  /* 表改变
  * @param formValue
  */
  formChange = (formValue) => {
    this.setState({
      value: formValue
    })
  };

  /**
   * 测试连接
   */
  testConnect = () => {
    form.validateAll((errors, values) => {
      const that = this;
      let {arr} = this.state;
      const value = {};
      value["parametersVos"] = arr;
      value["dataSourceVo"] = values;
      axios.post(url.url + '/v1/tDataSource/testDataSourceConnect', value)
        .then(function (response) {
          const {data} = response;
          if (data.code === 1) {
            Message.warning(data.message ? data.message : data.data);
          } else {
            Message.success("测试连接成功.");
          }
        })
        .catch(function (error) {
          Message.error(error.message);
        })
    });
  };

  /**
   * 表验证
   */
  validateAllFormField = () => {
    const that = this;
    form.validateAll((errors, values) => {
      let {arr} = that.state;
      const value = {};
      value["parametersVos"] = arr;
      value["dataSourceVo"] = values;
      const urls = that.state.id ? url.url + '/v1/tDataSource/updateDataSource' : url.url + '/v1/tDataSource/addDataSource';
      axios.post(urls, value)
        .then(function (response) {
          const {data} = response;
          if (data.code === 1) {
            Message.warning(data.message ? data.message : data.data);
          } else {
            Message.success("操作成功.");
            that.props.history.go(-1);
          }
        })
        .catch(function (error) {
          Message.error(error.message);
        })
    });
  };
  /**
   * 取消提示弹框
   */
  onCloseDialog = reason => {
    this.setState({
      visible: false
    });
  };

  /**
   * 新增参数
   */
  handleClickAdd = () => {
    const arr = this.state.arr;
    arr.push({
      _id: Math.random().toString(36).substring(2),
      name: "",
      value: ""
    });
    this.setState(
      {
        arr: arr
      }
    )
  };
  /**
   * 删除参数
   */
  deleteClick = (ob) => {
    const {arr} = this.state;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]["_id"] === ob["_id"]) {
        arr.splice(i, 1);
        break;
      }
    }
    this.setState(
      {
        arr: arr
      }
    );

  };


  /**
   *
   * @param value value: {String} 数据
   * @param event e_: {Event} DOM事件对象
   */
  changeKey = (value, event) => {
    const id = event.target.id;
    const {arr} = this.state;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]["_id"] + "_key" === id) {
        arr[i]["name"] = value;
      }
    }
    this.setState(
      {
        arr: arr
      }
    )
  };

  /**
   *
   * @param value value: {String} 数据
   * @param event e_: {Event} DOM事件对象
   */
  changeValue = (value, event) => {
    const id = event.target.id;
    const {arr} = this.state;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]["_id"] + "_value" === id) {
        arr[i]["value"] = value;
      }
    }
    this.setState(
      {
        arr: arr
      }
    )
  };

  /**
   * 获取数据
   */
  getSchemaList = (f) => {
    if (f === 1) {
      return;
    }
    form.validateAll((errors, values) => {
      if (!this.state.value.userName ||
        !this.state.value.password ||
        !this.state.value.port ||
        !this.state.value.ip) {
        return;
      }
      const that = this;
      let {arr} = this.state;
      const value = {};
      value["parametersVos"] = arr;
      value["dataSourceVo"] = values;
      axios.post(url.url + '/v1/tDataSource/getSchema', value)
        .then(function (response) {
          const {data} = response;
          if (data.code === 1) {
            Message.warning(data.message ? data.message : data.data);
          } else {
            that.setState(
              {
                schemaList: data.data
              }
            )
          }
        })
        .catch(function (error) {
          Message.error(error.message);
        })
    });
  };
  /**
   * 修改数据类型
   * @param value 新的值
   * @param event 事件
   */
  changeDatasourceType = (value, event) => {
    if (value.toUpperCase() === "MYSQL") {
      this.state.value.port = "3306";
      this.state.value.userName = "root";
      this.state.value.password = "password";
    } else if (value.toUpperCase() === "SQLSERVER") {
      this.state.value.port = "1433";
      this.state.value.userName = "sa";
      this.state.value.password = "password";
    } else {
      this.state.value.drive = "";
      this.state.placeholder = "";
    }
    const ty = this.state.types.filter(
      o => {
        return o.id === value;
      }
    );
    this.setState({typeConfig: ty[0]}, () => {

    });
  };

  /**
   * 表
   * @returns {*}
   */
  render() {
    return (
      <div>
        <div className='container-header'>
          <p style={{display: 'inline-block'}}>{this.state.id ? "修改数据源" : "新建数据源"}</p>
          <Button type="normal" size="small" className='next-btn-normal table-btn-return' style={{float: 'right'}}>
            <a onClick={() => {
              this.props.history.go(-1)
            }}> 返回</a>
          </Button>
        </div>


        <IceContainer className='container-main'>
          <IceFormBinderWrapper
            value={this.state.value}
            onChange={this.formChange}
            ref={formRef => form = formRef}
          >
            <div className={styles.formContent}>
              <h4 className={styles.dTitle}>基础信息</h4>
              <div className={styles.formItem}>
                <div className={styles.formLabel}><span className={styles.red}>*</span>数据源类型：</div>
                <IceFormBinder required name="sourceType" message="数据源类型不能为空">
                  <Select
                    placeholder="请选择"
                    className={styles.inputNme} onChange={this.changeDatasourceType}
                  >
                    {
                      this.state.types.map(
                        o => {
                          return (
                            <Option value={o.id}>{o.sourceType}</Option>
                          )
                        }
                      )
                    }
                  </Select>
                </IceFormBinder>
                <div className={styles.formError}>
                  <IceFormError name="sourceType"/>
                </div>
              </div>
              <div className={styles.formItem}>
                <div className={styles.formLabel}><span className={styles.red}>*</span>数据源名称：</div>
                <IceFormBinder
                  required
                  triggerType="onBlur"
                  message=" 数据源名称不能为空"
                  name="sourceName"
                >
                  <Input
                    placeholder="请输入数据源名称"
                    className={styles.inputNme}
                  />
                </IceFormBinder>
                <div className={styles.formError}>
                  <IceFormError name="sourceName"/>
                </div>
              </div>
              <div className={styles.formItem}>
                <div className={styles.formLabel}>描述:</div>
                <IceFormBinder
                  triggerType="onBlur"
                  name="content"
                >
                  <Input.TextArea
                    maxLength={50}
                    rows={8}
                    hasLimitHint
                    placeholder="请输入描述"
                    className={styles.inputNme}
                  />
                </IceFormBinder>
              </div>
              <div className={styles.formItem}>
                <div className={styles.formLabel}><span className={styles.red}>*</span>链接地址：</div>
                <IceFormBinder
                  required={true}
                  triggerType="onBlur"
                  message=" 链接地址不能为空"
                  name="ip"
                >
                  <Input
                    placeholder={true}
                    className={styles.inputNme}
                  />
                </IceFormBinder>
                <div className={styles.formError}>
                  <IceFormError name="ip"/>
                </div>
              </div>
              <div className={styles.formItem}>
                <div className={styles.formLabel}><span
                  className={styles.red}>*</span>端口号：
                </div>
                <IceFormBinder
                  required={true}
                  triggerType="onBlur"
                  message=" 端口号不能为空"
                  name="port"
                >
                  <Input
                    placeholder={this.state.placeholder}
                    className={styles.inputNme}
                  />
                </IceFormBinder>
                <div className={styles.formError}>
                  <IceFormError name="port"/>
                </div>
              </div>

              <div className={styles.formItem}>
                <div className={styles.formLabel}><span className={styles.red}>*</span>用户名：</div>
                <IceFormBinder
                  required={true}
                  triggerType="onBlur"
                  message=" 用户名不能为空"
                  name="userName"
                >
                  <Input
                    placeholder="请输入用户名"
                    className={styles.inputNme}
                  />
                </IceFormBinder>
                <div className={styles.formError}>
                  <IceFormError name="userName"/>
                </div>
              </div>
              <div className={styles.formItem}>
                <div className={styles.formLabel}><span className={styles.red}>*</span> 密码：</div>
                <IceFormBinder
                  required={true}
                  triggerType="onBlur"
                  message=" 密码不能为空"
                  name="password"
                >
                  <Input placeholder="请输入密码"
                         className={styles.inputNme}
                  />
                </IceFormBinder>
                <div className={styles.formError}>
                  <IceFormError name="password"/>
                </div>
              </div>
              <div className={styles.formItem}>
                <div className={styles.formLabel}> 选取数据库：</div>
                <IceFormBinder
                  required={true}
                  triggerType="onBlur"
                  message=" 密码不能为空"
                  name="sourceSchema"
                >
                  <Select
                    placeholder="请选择"
                    className={styles.inputNme}
                  >
                    {
                      this.state.schemaList.map(
                        o => {
                          return (
                            <Option value={o}>{o}</Option>
                          )
                        }
                      )
                    }
                  </Select>
                </IceFormBinder>
                <Button
                  type="primary"
                  className={styles.submitButton}
                  onClick={this.getSchemaList}
                >
                  获取数据库信息
                </Button>
                <div className={styles.formError}>
                  <IceFormError name="sourceSchema"/>
                </div>
              </div>
              <div className={styles.formItem}>
                <div className={styles.formLabel}><span className={styles.red}>*</span>数据源方向：</div>
                <IceFormBinder required name="dataDirection" message="数据源方向不能为空">
                  <Select
                    placeholder="请选择"
                    className={styles.inputNme}
                  >
                    <Option value="IN">IN</Option>
                    <Option value="OUT">OUT</Option>
                    <Option value="IN_OUT">IN_OUT</Option>
                  </Select>
                </IceFormBinder>
                <div className={styles.formError}>
                  <IceFormError name="dataDirection"/>
                </div>
              </div>

              <div>
                <div className={styles.formContent}>
                  <h4 className={styles.dTitle}>参数设置</h4>
                  <div className={styles.container} style={{marginTop: '0'}}>
                    <div className={styles.buttons}>
                      <Button
                        className={styles.button}
                        onClick={() => this.handleClickAdd()}
                      >
                        添加参数
                      </Button>
                    </div>
                  </div>
                </div>
                {
                  this.state.arr.map(
                    (o, index) => {

                      return (
                        <div id="addInput" className={styles.formItem}>
                          <div className={styles.formLabel}> 参数名称：</div>
                          <IceFormBinder name={o._id + "_key"}
                                         required
                                         triggerType="onBlur"
                                         message=" 参数名称不能为空"
                          >
                            <Input id={o._id + "_key"}
                                   placeholder="请输入参数名称" onChange={this.changeKey}
                                   className={styles.inputKeyValueNme}
                            />
                          </IceFormBinder>
                          <div className={styles.formError}>
                            <IceFormError name="title"/>
                          </div>
                          <div className={styles.formLabel}> 参数值：</div>
                          <IceFormBinder
                            required name={o._id + "_value"}
                            triggerType="onBlur"
                            message=" 参数值不能为空"
                          >
                            <Input id={o._id + "_value"}
                                   onChange={this.changeValue}
                                   placeholder="请输入参数值"
                                   className={styles.inputKeyValueNme}
                            />
                          </IceFormBinder>
                          <div className={styles.formError}>
                            <IceFormError name="title"/>
                          </div>
                          <Button type="normal" onClick={() => this.deleteClick(o)}
                                  warning>删除参数</Button> &nbsp;&nbsp;
                        </div>
                      )
                    }
                  )
                }
              </div>
              <Button
                type="primary"
                className='sync-btn-submit'
                onClick={this.testConnect}
              >
                测试连接
              </Button> &nbsp;&nbsp;
              <Button
                type="primary"
                className='sync-btn-submit'
                onClick={this.validateAllFormField}
              >
                提 交
              </Button> &nbsp;&nbsp;
              <Button
                type="primary"
                className='zgph-btn-cancel'
                onClick={() => {
                  this.props.history.go(-1)
                }}
              >
                取 消
              </Button>
            </div>
          </IceFormBinderWrapper>
        </IceContainer>
      </div>
    );
  }

}

export default DataSourceAdd;
