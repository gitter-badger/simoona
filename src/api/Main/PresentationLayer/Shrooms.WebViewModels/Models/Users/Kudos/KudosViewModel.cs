﻿using Shrooms.WebViewModels.Models.User;

namespace Shrooms.WebViewModels.Models.Kudos
{
    public class KudosViewModel
    {
        public ApplicationUserViewModel Employee { get; set; }

        public decimal Points { get; set; }

        public KudosTypeViewModel Type { get; set; }
    }
}