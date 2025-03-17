using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Newtonsoft.Json;

namespace app
{
    public partial class CreateQuizs : Form
    {
        private static readonly HttpClient client = new HttpClient();

        public CreateQuizs()
        {
            InitializeComponent();
        }

        private async void btnConfirm_Click(object sender, EventArgs e)
        {
            // Handle the confirmation button click
            if (!string.IsNullOrWhiteSpace(txtQuestion.Text))
            {
                // Call API to localhost:3000/transcript to create a question
                var videoUrl = txtQuestion.Text;
                var response = await CallApi(videoUrl);

                if (response.IsSuccessStatusCode)
                {
                    MessageBox.Show("Câu hỏi đã được tạo!", "Thông báo",
                        MessageBoxButtons.OK, MessageBoxIcon.Information);
                }
                else
                {
                    MessageBox.Show("Đã xảy ra lỗi khi tạo câu hỏi!", "Lỗi",
                        MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
            else
            {
                MessageBox.Show("Vui lòng nhập câu hỏi!", "Cảnh báo",
                    MessageBoxButtons.OK, MessageBoxIcon.Warning);
            }
        }

        private async Task<HttpResponseMessage> CallApi(string videoUrl)
        {
            var requestBody = new { videoUrl = videoUrl };
            var json = JsonConvert.SerializeObject(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            return await client.PostAsync("http://localhost:3000/transcript", content);
        }
    }
}
