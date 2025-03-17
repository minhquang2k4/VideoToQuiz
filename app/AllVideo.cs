using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Data.SqlClient;

namespace app
{
    public partial class AllVideo : Form
    {
        public AllVideo()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            string strconnectstring = System.Configuration.ConfigurationSettings.AppSettings["MyConnectString"].ToString();
            string strCommand = "select * from Video";

            SqlConnection conn = new System.Data.SqlClient.SqlConnection(strconnectstring);

            SqlDataAdapter da = new SqlDataAdapter(strCommand, conn);

            DataSet ds = new DataSet();
            da.Fill(ds, "MyCustomer");

            if (ds.Tables.Count > 0)
            {
                string result = "";
                foreach (DataRow row in ds.Tables[0].Rows)
                {
                    result += $"{row[0]}, {row[1]}, {row[2]}\n";
                }
                MessageBox.Show(result, "DataSet Data", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
            else
            {
                MessageBox.Show("DataSet rỗng!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            }


        }
    }
}
